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

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import * as Constants from '../constants';
import {
  generateEncryptionKeyPair,
  generateSigningKeyPair,
  deriveSharedSecret,
  keyExchange
} from '../services/CryptoService';
import { encodeBase64 } from 'tweetnacl-util';
import { getProcessStatus, getProcessStepStatus, initiateProcess } from '../services/ProcessService';

const ProcessContext = createContext(null);

export const useProcess = () => {
  const ctx = useContext(ProcessContext);
  if (!ctx) throw new Error("useProcess must be used within a ProcessProvider");
  return ctx;
};

export const ProcessProvider = ({ children }) => {
  const [processId, setProcessId] = useState(null);
  const [processStatus, setProcessStatus] = useState(null);
  const [connectionId, setConnectionId] = useState(null); 
  const connectionKeys = useRef(new Map());


  // 🔐 Initialize keys and perform key exchange
  const initializeKeys = useCallback(async () => {
    // Get the connection Id from local storage
    const connectionId = localStorage.getItem(Constants.CONNECTION_ID)|| "";
    // set the connection id 

    // console.log ('Initializing keys...')
    const signingKeys = generateSigningKeyPair();
    const encryptionKeys = generateEncryptionKeyPair();

    connectionKeys.current[Constants.SIGN_PUBLIC_KEY] = encodeBase64(signingKeys.publicKey);
    connectionKeys.current[Constants.SIGN_PRIVATE_KEY] = encodeBase64(signingKeys.secretKey);
    connectionKeys.current[Constants.ENCRYPTION_PUBLIC_KEY] = encodeBase64(encryptionKeys.publicKey);
    connectionKeys.current[Constants.ENCRYPTION_PRIVATE_KEY] = encodeBase64(encryptionKeys.secretKey);

    const payload = {
      connectionId: connectionId,
        publicKey: connectionKeys.current[Constants.ENCRYPTION_PUBLIC_KEY]
    }
    const response = await keyExchange (payload)
    // console.log ('Key Exchange Response: ', response)
    const serverPublicKey = response.publicKey;
    setConnectionId(response.connectionId);

    localStorage.setItem(Constants.CONNECTION_ID, response.connectionId);

    const sharedSecret = deriveSharedSecret(
      connectionKeys.current[Constants.ENCRYPTION_PRIVATE_KEY],
      serverPublicKey
    );
    connectionKeys.current[Constants.SHARED_SECRET] = sharedSecret;

    // console.log ('Initialized Keys: ', connectionKeys.current)
  }, []);

  // Start the actual process (registration, auth, deletion)
  const startProcess = useCallback(async (payload) => {
    const processInstance = await initiateProcess(payload);
    setProcessId(processInstance.processId);
  }, []);

 // Poll for a total maximum duration to poll. poll Interval is how often to poll 
 const pollProcessStatus = useCallback(async (maxWaitMs = Constants.MAX_WAIT_TIME, pollIntervalMs = Constants.POLL_INTERVAL_10S) => {
  if (!processId) return;
  // console.log ('Starting to poll for process status: ', processId)
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    const res = await getProcessStatus(processId);

    if (!res || !res.processStatus) {
      console.warn('Invalid response or missing stepStatus');
    } else {
      const status = res.processStatus;
      setProcessStatus(status);
      if (status === Constants.PROCESS_COMPLETED) {
        return res; // Exit the loop and function if the status is completed
      }
    }
    // Wait before the next poll
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }
  console.warn(`Polling ended after ${maxWaitMs / 1000}s without completing the process step`);
  return null;
}, [processId]);
  

  // Poll for a total maximum duration to poll. poll Interval is how often to poll 
  const pollProcessStepStatus = useCallback(async (stepCode, maxWaitMs = Constants.MAX_WAIT_TIME, pollIntervalMs = Constants.POLL_INTERVAL_1S) => {
    if (!processId) return;
    // console.log ('Waiting for step status: ', stepCode, " with Max Wait: ", maxWaitMs, " and Poll Interval: ", pollIntervalMs)
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitMs) {
      const res = await getProcessStepStatus(processId, stepCode);
      // console.log('Process Step:', res);
  
      if (!res || !res.stepStatus) {
        console.warn('Invalid response or missing stepStatus');
      } else {
        const status = res.stepStatus;
        // console.log('Process Step Status:', status);
        if (status === Constants.PROCESS_COMPLETED || status === Constants.PROCESS_ABORTED) {
          return res; // Exit the loop and function if the status is completed
        }
      }
  
      // Wait before the next poll
      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }
  
    console.warn(`Polling ended after ${maxWaitMs / 1000}s without completing the process step`);
    return null;
  }, [processId]);

  const clearProcess = () => {
    setProcessId(null);
    setConnectionId(null);
    connectionKeys.current = new Map();
    setProcessStatus(null);
  };
  
  
  return (
    <ProcessContext.Provider value={{
      initializeKeys,
      connectionId,
      connectionKeys: connectionKeys.current,
      processId,
      startProcess,
      pollProcessStatus,
      pollProcessStepStatus,
      clearProcess,
      processStatus
      
      // sessionComplete,
      // setSessionComplete,
      // getProcessInitialized,
      // setProcessInitialized,
      
    }}>
      {children}
    </ProcessContext.Provider>
  );
};
