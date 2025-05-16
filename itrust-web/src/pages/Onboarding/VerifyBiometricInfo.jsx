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

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";

import RegisterInfo from "./RegisterInfo";
import StatusMessage from "../../components/StatusMessage";
import { Cancel } from "@mui/icons-material";
// import FaceBiometricsPanel from "../../components/FaceBiometricsPanel";
import * as Constants from "../../constants"

export default function VerifyBiometricInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Status message 
  const [status, setStatus] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const location = useLocation();




  useEffect(() => {
    // Add a listener to iframe events received from the auth widget
    window.addEventListener('message', function (event) {
      if (event.data.type === 'itrust-event') {
        console.log('Received message from iTrust: ', event.data)
        navigate("/register" + location.search, { state: { method: "da", tab: 1, verifySuccess: true, verifiedData: event.data?.payload } });
      }
    }, false)
  }, []);

  const handleCancel = (e) => {
    navigate("/register" + location.search, { state: { method: "da", tab: 1, verifySuccess: false } });
  };


  return loading ? (
     <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
      <GridLoader color="#cc0404" />
    </Box>
  ) : (
    <Box display="flex" height="100vh">
      <StatusMessage status={status} setStatus={setStatus} />
      <Box display="flex" flexDirection="column" bgcolor={"#cc0404"} width="30%">
        <RegisterInfo />
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" width="70%" bgcolor={"black"}>
        <Card elevation={0} sx={{ width: "100%" }}>
          <CardHeader
            title="Verify your identity"
            titleTypographyProps={{ color: "primary.main", variant: "title" }}
            subheader="Scan and Register with your Biometric Information"
            subheaderTypographyProps={{ variant: "body1" }}
            sx={{ textAlign: "center" }}
            action={
              <Button startIcon={<Cancel />} onClick={handleCancel} color="secondary">
                Cancel
              </Button>
            }
          />

          <CardContent>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="400px" height="400px" sx={{ overflow: "auto"}}>
                <iframe id="itrust-login" src={`${Constants.ITRUST_LOGIN_URL}?op=reg`} allow="camera *;microphone *" style={{ WebkitOverflowScrolling: "touch", overflow: "auto", border: 0, height: "100%", width: "100%" }}></iframe>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

