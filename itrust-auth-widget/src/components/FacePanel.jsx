
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
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GridLoader } from 'react-spinners';
import * as Constants from '../constants';
import { CheckCircle, Cancel, Warning } from '@mui/icons-material';
import { useProcess } from '../context/ProcessContext';
import { decryptMessage } from '../services/CryptoService';

export default function FacePanel({ operation, nextStep, launchUrl, setStatus }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const [sessionComplete, setSessionComplete] = useState(false);

  const { processId, pollProcessStepStatus, connectionKeys } = useProcess();

  // Poll for process step status
  useEffect(() => {
    if (!processId) return;
    const receiveIdentityInformation = async () => {
      try {
        const result = await pollProcessStepStatus("receive.identity_information", Constants.REGISTRATION_MAX_WAIT_TIME, Constants.POLL_INTERVAL_3S);
        console.log('[FacePanel] Received Identity Information:', result);

        console.log ('FacePanel (via poll): Private ID Session complete')
        
        setSessionComplete(true)
      } catch (err) {
        console.error('Error fetching process status:', err);
        setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
      }
    };
    receiveIdentityInformation();
  }, [processId]);


  // Listen for messages from the iframe
  useEffect(() => {
    const handleSessionComplete = async (event) => {
      if (event.data.type === 'SESSION_COMPLETE') {
        console.log ('FacePanel (via event): Private ID Session complete')
        setSessionComplete(true); // 
      }
    }
    window.addEventListener('message', handleSessionComplete)
    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('message', handleSessionComplete)
    }
  }, []);

  // Get the result for the search frame before moving to next step 
  useEffect(() => {
    console.log ('FacePanel: Session complete - useEffect', sessionComplete)
    if (sessionComplete) {
      console.log ('FacePanel: Session complete - handleSearchResult')
      handleSearchResult();
    }
  }, [sessionComplete]);

  const handleSearchResult = async () => {
    // Poll and get the result for the search step. 
    try {
      const result = await pollProcessStepStatus("search.digital_address", Constants.MAX_WAIT_TIME, Constants.POLL_INTERVAL_1S);
      console.log ('[FacePanel] Search Result:', result);
      const message = result.clientResponse ? JSON.parse(result.clientResponse) : null;
      console.log ('[FacePanel] Search Result Message:', message);

      // This would be in encrypted format 
      const decryptedMessage = decryptMessage(message.data, message.nonce, connectionKeys[Constants.SHARED_SECRET])
      const response = JSON.parse(decryptedMessage)
      console.log ('[FacePanel] Search Result Decrypted:', response);

      // Make a copy of the response as payload 
      const payload = { ...response.data }
      payload.status = response?.status
      payload.statusDescription = response?.statusDescription
      console.log ('[FacePanel] Search Result Payload:', payload);

      switch (response.type) {
        case Constants.DigitalAddressFound:
          handleDigitalAddressFound(payload);
          break
        case Constants.DigitalAddressNotFound:
          handleDigitalAddressNotFound(payload);
          break
        default:
          console.log('Face Panel: Unknown message type', response.type);
      }
    } catch (err) {
      console.error('Error fetching process status:', err);
      setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
    }
  }

  // Event to handle the Digital Address found 
  const handleDigitalAddressFound = (payload) => {
    console.log ('Face Panel: Digital Address Found', payload)
    // If the request is to authenticate, and digital address is found - Success case
    if (operation === Constants.OPERATION_AUTHENTICATE) {
      payload.background = 'green'
      payload.icon = (<CheckCircle sx={{ fontSize: '8rem', color: 'white' }} />)
      payload.authenticated = true
      nextStep(Constants.PANEL_STATUS, payload)
    } else if (operation === Constants.OPERATION_REGISTER) {
      payload.background = 'red'
      payload.icon = (<Cancel sx={{ fontSize: '8rem', color: 'white' }} />)
      payload.authenticate = true
      nextStep(Constants.PANEL_STATUS, payload)
    } else if (operation === Constants.OPERATION_DELETE) {
      console.log ('Face Panel: Digital Address Found - Delete')
      payload.background = 'green'
      payload.icon = (<CheckCircle sx={{ fontSize: '8rem', color: 'white' }} />)
      payload.deleteProgress = true
      nextStep(Constants.PANEL_STATUS, payload)
    }
  }

  const handleDigitalAddressNotFound = (payload) => {
    console.log ('Face Panel: Digital Address Not Found', payload)
    // If the request is to authenticate, and digital address is not found - Error case
    if (operation === Constants.OPERATION_AUTHENTICATE) {
      payload.background = 'red'
      payload.icon = (<Cancel sx={{ fontSize: '8rem', color: 'white' }} />)
      payload.enroll = true
      nextStep(Constants.PANEL_STATUS, payload)
    } else if (operation === Constants.OPERATION_REGISTER) {
      payload.background = 'green'
      payload.icon = (<CheckCircle sx={{ fontSize: '8rem', color: 'white' }} />)
      payload.enrollProgress = true
      nextStep(Constants.PANEL_STATUS, payload)
    }else if (operation === Constants.OPERATION_DELETE) {
      payload.background = 'red'
      payload.icon = (<Cancel sx={{ fontSize: '8rem', color: 'white' }} />)
      payload.deleteProgress = false
      nextStep(Constants.PANEL_STATUS, payload)
    } 
  }


  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100vw" height="100vh">
      {!iframeLoaded && <GridLoader color="#cc0404" />}
      <iframe
        id="itrust-face"
        title="Face Panel"
        onLoad={() => setIframeLoaded(true)}
        src={launchUrl}
        allow="camera *;microphone *"
        style={{
          WebkitOverflowScrolling: 'touch',
          overflow: 'auto',
          border: 0,
          width: '100%',
          height: '100%',
          display: iframeLoaded ? 'block' : 'none'
        }}
      />
    </Box>
  );
}
