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

import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { BeatLoader, GridLoader } from 'react-spinners';

import * as Constants from '../constants';
import { useProcess } from '../context/ProcessContext';


export default function CompletePanel({ operation, payload }) {
  const { clearProcess } = useProcess();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('CompletePanel: operation:', operation, ' payload:', payload);

    const fireEventToParent = async () => {
      const parentResponse = {
        type: payload?.type,
        status: payload?.status,
        statusDescription: payload?.statusDescription,
        // message: payload?.message,
        data: {
          did: payload?.data?.did,
          digitalAddress: payload?.data?.digitalAddress,
          identityInformation: payload?.data?.identityInformation,
          contactInformation: payload?.data?.contactInformation,
        }
      }
      const response = {
        type: Constants.ITRUST_EVENT,
        payload: parentResponse
      };
      console.log('CompletePanel: fireEventToParent:', response);

      // Handle three types of embedded contexts 
      // Standard web (via postMessage)
      // React Native WebView (window.ReactNativeWebView.postMessage)
      // iOS WebKit (window.webkit.messageHandlers.X.postMessage)

        // 1. Standard Web postMessage
        try {
          window?.parent?.postMessage(response, "*");
        } catch (err) {
          console.warn("Standard postMessage failed:", err);
        }
    
        // 2. React Native WebView bridge
        try {
          // send message to superapp
          if (superapp) {
            console.log ('>>>> Sending message to superapp')
            superapp.onDataReceived(JSON.stringify(response))
          }
          

          if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === "function") {
            console.log ('>>>> Sending message to ReactNativeWebView')
            window.ReactNativeWebView.postMessage(JSON.stringify(response));
          }
      } catch (err) {
        console.warn("ReactNativeWebView postMessage failed:", err);
      }
    
        // 3. iOS WebKit bridge
        try {
          if (window.webkit?.messageHandlers?.authStatus) {
            window.webkit.messageHandlers.authStatus.postMessage(response);
          }
      } catch (err) {
        console.warn("WebKit messageHandler failed:", err);
      }

    }

    setLoading(true);
    // Clear current process context
    clearProcess();


    let timer
    if (operation === Constants.OPERATION_REGISTER) {
      setLoading(false);
      timer = setTimeout(() => {
        fireEventToParent();
      }, Constants.STANDARD_DELAY);
    } else {
      // skip and directly fire 
      setLoading(false);
      fireEventToParent();
    }

    return () => clearTimeout(timer);
  }, []);



  return loading ? (
    <Box display="flex" flexDirection="column" width="100vw" height="100vh" justifyContent="center" alignItems="center" >
      <GridLoader color="#cc0404" />
    </Box>
  ) : (
    <Box display="flex" flexDirection="column" width="100vw" height="100vh" justifyContent="center" alignItems="center">
      {operation === Constants.OPERATION_REGISTER && (
        <Box display="flex" flexDirection="column" mt={2} boxShadow={4} p={2} sx={{
          maxWidth: '90vw',
          wordWrap: 'break-word'
        }}>
          <Typography variant="headline" mb={2}>Your Digital Address</Typography>
          <Typography variant="body1" fontWeight="bold">Digital Address</Typography>
          <Typography variant='body1' gutterBottom>{payload?.data?.digitalAddress}</Typography>
          <Typography variant="body1" fontWeight="bold">DID</Typography>
          <Typography variant='body1' gutterBottom>{payload?.data?.did}</Typography>
        </Box>
      )}

      {/* <Stack direction="row" justifyContent="center" alignItems="center" mt={2} gap={2}>
        <Typography variant="subtitle1">Redirecting. Please wait...</Typography>
        <BeatLoader color="#cc0404" size="8px" />
      </Stack> */}
    </Box>
  );
}
