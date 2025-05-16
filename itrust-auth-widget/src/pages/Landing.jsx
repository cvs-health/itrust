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

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { GridLoader } from "react-spinners";
import * as Constants from "../constants";

import FacePanel from "../components/FacePanel";
import StatusPanel from "../components/StatusPanel";
import CompletePanel from "../components/CompletePanel";
import StatusMessage from "../components/StatusMessage";

import { useProcess } from "../context/ProcessContext";

export default function Landing() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ open: false, type: "success", message: "" });
  const [launchUrl, setLaunchUrl] = useState(null);
  const [currentStep, setCurrentStep] = useState(Constants.MAIN_PANEL);
  const [payload, setPayload] = useState({});
  // const [processId, setProcessId] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const operation = params.get("op") || Constants.OPERATION_AUTHENTICATE;
  const withAccessToken = params.get("withAccessToken") === "true";
  const withIdentityInfo = params.get("withIdentityInfo") === "true";
  const did = params.get("did");

  const { initializeKeys, startProcess, connectionId, processId, pollProcessStepStatus, clearProcess } = useProcess();

  useEffect(() => {
    clearProcess();
    initializeKeys();
  }, [location.key]);

  useEffect(() => {
    const getLaunchUrl = async () => {
      try {
        const result = await pollProcessStepStatus("initialize.identity_verifier", Constants.MAX_WAIT_TIME, Constants.POLL_INTERVAL_1S);
        // console.log("[Landing] Process Step Status:", result);
        if (result.stepStatus === Constants.PROCESS_COMPLETED) {
          const stepData = result.stepData ? JSON.parse(result.stepData) : null;
          if (stepData && stepData.launchUrl) {
            console.log('Launch URL: ', stepData.launchUrl)
            setLaunchUrl(stepData.launchUrl);
            setLoading(false);
            setCurrentStep(Constants.PANEL_FACE);
          } else {
            setStatus({ open: true, type: "error", message: "Failed to fetch launch URL" });
          }
        }
        // else {
        //   // Optional: re-poll after a delay if not ready
        //   console.log('Polling for process step status: ', processId)
        //   setTimeout(getLaunchUrl, Constants.POLL_INTERVAL_1S || 3000);
        // }
      } catch (err) {
        setStatus({ open: true, type: "error", message: "Failed to fetch process status" });
      }
    };

    // console.log('[Landing] connectionId updated to: ', connectionId);
    // console.log('[Landing] processId : ', processId);
    if (connectionId && !processId) {
      startPrivateIdSession(operation);
      // console.log('Process Initialized: ', processId)
    }
    if (connectionId && processId) {
      // console.log('Polling for process status: ', processId)
      getLaunchUrl();

    }
  }, [connectionId, processId]);



  // Start Private Id Session
  const startPrivateIdSession = async (operation) => {
    let message = {}
    switch (operation) {
      case Constants.OPERATION_REGISTER:
        message = {
          type: Constants.UserRegistrationStart,
          data: {
            "connectionId": connectionId,
            "operation": Constants.OPERATION_REGISTER,
            "withIdentityInfo": withIdentityInfo,
            "withAccessToken": withAccessToken,
          }
        }
        break;
      case Constants.OPERATION_AUTHENTICATE:
        message = {
          type: Constants.UserAuthenticationStart,
          data: {
            "connectionId": connectionId,
            "operation": Constants.OPERATION_AUTHENTICATE,
            "withIdentityInfo": withIdentityInfo,
            "withAccessToken": withAccessToken,
          }
        }
        break;
      case Constants.OPERATION_DELETE:
        message = {
          type: Constants.UserOffboardingStart,
          data: {
            "connectionId": connectionId,
            "operation": Constants.OPERATION_DELETE,
            "did": did
          }
        }
        break;
      default:
        console.error('Invalid operation: ', operation)
        return;
    }

    // Start Private Id session
    await startProcess(message);
  }


  const nextStep = (next, payload) => {
    setPayload(payload);
    setCurrentStep(next);
  };

  return loading ? (
    <Box display="flex" flexDirection="column" width="100vw" height="100vh" justifyContent="center" alignItems="center">
      <GridLoader color="#cc0404" />
      <Typography variant="headline" mt={2}>
        Initializing ...
      </Typography>
    </Box>
  ) : (
    <Box display="flex" flexDirection="column" width="100vw" height="100vh" justifyContent="center" alignItems="center">
      <StatusMessage status={status} changeStatus={setStatus} />

      {launchUrl && currentStep === Constants.PANEL_FACE && (
        <FacePanel launchUrl={launchUrl} operation={operation} nextStep={nextStep} setStatus={setStatus} />
      )}

      {currentStep === Constants.PANEL_STATUS && (
        <StatusPanel operation={operation} nextStep={nextStep} payload={payload} setStatus={setStatus} />
      )}

      {currentStep === Constants.PANEL_COMPLETE && (
        <CompletePanel operation={operation} payload={payload} setStatus={setStatus} />
      )}
    </Box>
  );
}
