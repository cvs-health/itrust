/*
 Copyright 2024 CVS Health and/or one of its affiliates

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import * as Constants from '../constants';
import { Box, Stack, Typography } from '@mui/material';
import { CheckCircle, Login, PersonAdd } from '@mui/icons-material';
import { BeatLoader, GridLoader } from 'react-spinners';
import { useProcess } from '../context/ProcessContext';
import { decryptMessage } from '../services/CryptoService';
import { set } from 'date-fns';
import { useNavigate } from 'react-router';

export default function StatusPanel({ operation, nextStep, payload, setStatus }) {
  const [loading, setLoading] = useState(false);
  const [daCreated, setDaCreated] = useState(false)
  const [identityCredentialIssued, setIdentityCredentialIssued] = useState(false)
  const [registerWithIDP, setRegisterWithIDP] = useState(false)
  const [notificationSent, setNotificationSent] = useState(false)
  const [daMetadata, setDaMetadata] = useState({})

  // Delete information 
  const [vcRevoked, setVcRevoked] = useState(false)
  const [deleteIDPUser, setDeleteIDPUser] = useState(false)
  const [deleteDAMetadata, setDeleteDAMetadata] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  const { processId, pollProcessStepStatus, connectionKeys } = useProcess();
  const navigate = useNavigate();


  // Poll for process status
  useEffect(() => {
    if (!processId) return;
    if( payload?.status === Constants.Error)
      return;

    // poll registration steps 
    const pollRegistrationSteps = async () => {
      try {
        const res1 = await handleDigitalAddressCreated();
        // await new Promise(r => setTimeout(r, Constants.STANDARD_DELAY)); // visual pause
        const res2 = await handleIdentityCredentialIssued();
        // await new Promise(r => setTimeout(r, Constants.STANDARD_DELAY)); // visual pause
        const res3 = await handleDigitalAddressIDPRegistered();
        // await new Promise(r => setTimeout(r, Constants.STANDARD_DELAY)); // visual pause
        const res4 = await handleNotificationSent();
        // await new Promise(r => setTimeout(r, Constants.STANDARD_DELAY)); // visual pause

        // Wait on all requests to complete 
        await Promise.all([res1, res2, res3, res4]);
        console.log('Registration steps completed')
        setSessionComplete(true)

      }catch (err){
        console.error('Error in pollRegistrationSteps', err)
        setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
      }
    }

    const pollDeletionSteps = async () => {
      try {
        const res1 = await handleUserCredentialsRevoked();
        // await new Promise(r => setTimeout(r, Constants.STANDARD_DELAY)); // visual pause
        const res2 = await handleDigitalAddressIDPDeleted();
        // await new Promise(r => setTimeout(r, Constants.STANDARD_DELAY)); // visual pause
        const res3 = await handleDigitalAddressDeleted();
        // await new Promise(r => setTimeout(r, Constants.STANDARD_DELAY)); // visual pause
        const res4 = await handleNotificationSent();
        // await new Promise(r => setTimeout(r, Constants.STANDARD_DELAY)); // visual pause

        // Wait on all requests to complete 
        await Promise.all([res1, res2, res3, res4]);
        console.log('Deletion steps completed')
        setSessionComplete(true)
      }
      catch (err) {
        console.error('Error in pollDeletionSteps', err)
        setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
      }
    }

    if (operation === Constants.OPERATION_REGISTER) {
      pollRegistrationSteps();
    } else if (operation === Constants.OPERATION_DELETE) {
      pollDeletionSteps();
    } else {
      // No need to poll for the search step as the Status Panel 
      // appears only when the other steps are completed
      setSessionComplete(true)
    }
  }, [processId]);

// Move to the next step based on the process completion
  useEffect(() => {
    // If authenticated, complete the process
    if (operation === Constants.OPERATION_AUTHENTICATE) {
      if (payload?.authenticated) {
        setTimeout(() => {
          const event = {
            "type": Constants.STATE_AUTHENTICATED,
            "status": "success",
            "statusDescription": payload?.statusDescription,
            "data": payload
          }
          nextStep(Constants.PANEL_COMPLETE, event)
        }, Constants.STANDARD_DELAY)
      } else {
        const event = {
          "type": Constants.STATE_AUTHENTICATED,
          "status": "error",
          "statusDescription": payload?.statusDescription
        }
      }
    } else if (operation === Constants.OPERATION_REGISTER) {
      if (daCreated && identityCredentialIssued && registerWithIDP && notificationSent) {
        setTimeout(() => {
          const event = {
            "type": Constants.STATE_ENROLLED,
            "status": "success",
            "statusDescription": payload?.statusDescription,
            "data": daMetadata
          }
          nextStep(Constants.PANEL_COMPLETE, event)
        }, Constants.STANDARD_DELAY)
      }
    } else if (operation === Constants.OPERATION_DELETE) {
      if (vcRevoked && deleteIDPUser && deleteDAMetadata) {
        setTimeout(() => {
          const event = {
            "type": Constants.STATE_DELETED,
            "status": "success",
            "statusDescription": payload?.statusDescription
          }
          nextStep(Constants.PANEL_COMPLETE, event)
        }, Constants.STANDARD_DELAY)
      }
    }

  },[sessionComplete])

  const handleDigitalAddressCreated = async () => {
    try {
      const result = await pollProcessStepStatus("create.digital_address", Constants.REGISTRATION_MAX_WAIT_TIME, Constants.POLL_INTERVAL_1S);
      console.log('handleDigitalAddressCreated:', result)
      const message = result.clientResponse ? JSON.parse(result.clientResponse) : null;
      console.log('handleDigitalAddressCreated Message:', message)
      // This would be in encrypted format 
      const decryptedMessage = decryptMessage(message.data, message.nonce, connectionKeys[Constants.SHARED_SECRET])
      const response = JSON.parse(decryptedMessage)
      console.log('handleDigitalAddressCreated Decrypted:', response)
      setDaMetadata(response.data)
      setDaCreated(true)
      return response
    } catch (err) {
      setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
      console.error('Error in handleDigitalAddressCreated', err)
    }
  };

  const handleIdentityCredentialIssued = async () => {
    try {
      const result = await pollProcessStepStatus("issue.identity_vc", Constants.REGISTRATION_MAX_WAIT_TIME, Constants.POLL_INTERVAL_1S);
      console.log('handleIdentityCredentialIssued:', result)
      const message = result.clientResponse ? JSON.parse(result.clientResponse) : null;
      console.log('handleIdentityCredentialIssued Message:', message)
      // This would be in encrypted format 
      const decryptedMessage = decryptMessage(message.data, message.nonce, connectionKeys[Constants.SHARED_SECRET])
      const response = JSON.parse(decryptedMessage)
      console.log('handleIdentityCredentialIssued Decrypted:', response)
      setIdentityCredentialIssued(true)
      return response
    } catch (err) {
      setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
      console.error('Error in handleIdentityCredentialIssued', err)
    }
  };

  const handleDigitalAddressIDPRegistered = async () => {
    try {
      const result = await pollProcessStepStatus("idp.create_user", Constants.REGISTRATION_MAX_WAIT_TIME, Constants.POLL_INTERVAL_1S);
      console.log('handleDigitalAddressIDPRegistered:', result)
      const message = result.clientResponse ? JSON.parse(result.clientResponse) : null;
      console.log('handleDigitalAddressIDPRegistered Message:', message)
      // This would be in encrypted format 
      const decryptedMessage = decryptMessage(message.data, message.nonce, connectionKeys[Constants.SHARED_SECRET])
      const response = JSON.parse(decryptedMessage)
      console.log('handleDigitalAddressIDPRegistered Decrypted:', response)
      setRegisterWithIDP(true)
      return response
    } catch (err) {
      setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
      console.error('Error in handleDigitalAddressIDPRegistered', err)
    }
  }


  const handleUserCredentialsRevoked = async () => {
    try {
      const result = await pollProcessStepStatus("revoke.vc", Constants.REGISTRATION_MAX_WAIT_TIME, Constants.POLL_INTERVAL_1S);
      console.log('handleUserCredentialsRevoked:', result)
      const message = result.clientResponse ? JSON.parse(result.clientResponse) : null;
      console.log('handleUserCredentialsRevoked Message:', message)
      // This would be in encrypted format 
      const decryptedMessage = decryptMessage(message.data, message.nonce, connectionKeys[Constants.SHARED_SECRET])
      const response = JSON.parse(decryptedMessage)
      console.log('handleUserCredentialsRevoked Decrypted:', response)
      setVcRevoked(true)
      return response
    } catch (err) {
      setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
      console.error('Error in handleUserCredentialsRevoked', err)
    }
  }

  const handleDigitalAddressIDPDeleted = async () => {
    try {
      const result = await pollProcessStepStatus("idp.delete_user", Constants.REGISTRATION_MAX_WAIT_TIME, Constants.POLL_INTERVAL_1S);
      console.log('handleDigitalAddressIDPDeleted:', result)
      const message = result.clientResponse ? JSON.parse(result.clientResponse) : null;
      console.log('handleDigitalAddressIDPDeleted Message:', message)
      // This would be in encrypted format 
      const decryptedMessage = decryptMessage(message.data, message.nonce, connectionKeys[Constants.SHARED_SECRET])
      const response = JSON.parse(decryptedMessage)
      console.log('handleDigitalAddressIDPDeleted Decrypted:', response)
      setDeleteIDPUser(true)
      return response
    } catch (err) {
      setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
      console.error('Error in handleDigitalAddressIDPDeleted', err)
    }
  }

  const handleDigitalAddressDeleted = async () => {
    try {
      const result = await pollProcessStepStatus("delete.digital_address", Constants.REGISTRATION_MAX_WAIT_TIME, Constants.POLL_INTERVAL_1S);
      console.log('handleDigitalAddressDeleted:', result)
      const message = result.clientResponse ? JSON.parse(result.clientResponse) : null;
      console.log('handleDigitalAddressDeleted Message:', message)
      // This would be in encrypted format 
      const decryptedMessage = decryptMessage(message.data, message.nonce, connectionKeys[Constants.SHARED_SECRET])
      const response = JSON.parse(decryptedMessage)
      console.log('handleDigitalAddressDeleted Decrypted:', response)

      setDeleteDAMetadata(true)
      return response

    } catch (err) {
      setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
      console.error('Error in handleDigitalAddressDeleted', err)
    }
  }

  const handleNotificationSent = async () => {
    try {
      const result = await pollProcessStepStatus("notify.parties", Constants.REGISTRATION_MAX_WAIT_TIME, Constants.POLL_INTERVAL_1S);
      console.log('handleNotificationSent:', result)
      const message = result.clientResponse ? JSON.parse(result.clientResponse) : null;
      console.log('handleNotificationSent Message:', message)

      // This would be in encrypted format 
      const decryptedMessage = decryptMessage(message.data, message.nonce, connectionKeys[Constants.SHARED_SECRET])
      const response = JSON.parse(decryptedMessage)
      console.log('handleNotificationSent Decrypted:', response)
      setNotificationSent(true)
      
      return response
    } catch (err) {
      setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
      console.error('Error in handleNotificationSent', err)
    }
  }

  const navigateOnFailure = () => {
    setStatus({ open: true, type: "error", message: payload?.statusDescription });

    setTimeout(() => {
      if (payload?.enroll){
        navigate(`/?op=reg&withIdentityInfo=true&withAccessToken=true&ts=${Date.now()}`, { replace: true });
      }else if (payload?.authenticate){
        navigate(`/?op=auth&withIdentityInfo=true&withAccessToken=true&ts=${Date.now()}`, { replace: true });
      }
      
    }, Constants.STANDARD_DELAY)
  }

  return loading ? (
    <Box display="flex" flexDirection="column" width="100vw" height="100vh" justifyContent="center" alignItems="center" >
      <GridLoader color="#cc0404" />
    </Box>
  ) : (

    <Box data-testid="status-panel"  display="flex" flexDirection="column" justifyContent="center" height="100%" width="100%" alignItems="center" sx={{ bgcolor: payload.background }}>
      {payload.icon}
      <Typography variant="headline" p={2} mt={2} sx={{ color: 'white' }} >{payload?.statusDescription}</Typography>
      {payload?.enroll &&
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={2} gap={2} onClick={navigateOnFailure}>
          <PersonAdd sx={{ fontSize: '4rem', color: 'white' }} />
          <Typography variant="headline" sx={{ color: 'white' }}>Register Digital Address</Typography>
        </Box>
      }
      {
        payload?.authenticate &&
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={2} gap={2} onClick={navigateOnFailure} >
          <Login sx={{ fontSize: '4rem', color: 'white' }} />
          <Typography variant="headline" sx={{ color: 'white' }}>Authenticate with Digital Address</Typography>
        </Box>
      }
      {
        payload?.enrollProgress &&
        <Box display="flex" flexDirection="column" mt={2} gap={2} >
          <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={2}>
            {daCreated ? <CheckCircle sx={{ color: 'white' }} /> : <BeatLoader color="white" size="3px" />}
            <Typography variant="subtitle1" color="white">Creating Digital Address</Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={2}>
            {identityCredentialIssued ? <CheckCircle sx={{ color: 'white' }} /> : <BeatLoader color="white" size="3px" />}
            <Typography variant="subtitle1" color="white">Issuing Identity Credential</Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={2}>
            {registerWithIDP ? <CheckCircle sx={{ color: 'white' }} /> : <BeatLoader color="white" size="3px" />}
            <Typography variant="subtitle1" color="white">Registering with IDP</Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={2} >
            {notificationSent ? <CheckCircle sx={{ color: 'white' }} /> : <BeatLoader color="white" size="3px" />}
            <Typography variant="subtitle1" color="white">Sending Notifications</Typography>
          </Stack>
        </Box>
      }
      {
        payload?.deleteProgress &&
        <Box display="flex" flexDirection="column" mt={2} gap={2} >
          <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={2}>
            {vcRevoked ? <CheckCircle sx={{ color: 'white' }} /> : <BeatLoader color="white" size="3px" />}
            <Typography variant="subtitle1" color="white">Revoking Credentials</Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={2}>
            {deleteIDPUser ? <CheckCircle sx={{ color: 'white' }} /> : <BeatLoader color="white" size="3px" />}
            <Typography variant="subtitle1" color="white">Unlinking IDP information</Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={2} >
            {deleteDAMetadata ? <CheckCircle sx={{ color: 'white' }} /> : <BeatLoader color="white" size="3px" />}
            <Typography variant="subtitle1" color="white">Removing Digital Address Metadata</Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" gap={2} >
            {notificationSent ? <CheckCircle sx={{ color: 'white' }} /> : <BeatLoader color="white" size="3px" />}
            <Typography variant="subtitle1" color="white">Sending Notifications</Typography>
          </Stack>
        </Box>
      }

    </Box>
  )
}