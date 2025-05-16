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
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";

import RegisterInfo from "./RegisterInfo";
import StatusMessage from "../../components/StatusMessage";
import { handleFormChange } from "../../utils/FormUtils";
import { Cancel, Verified } from "@mui/icons-material";

export default function VerifyIssuerInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Status message 
  const [status, setStatus] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const location = useLocation();


  const [formData, setFormData] = useState({
    accountId: "",
    zipcode: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    accountId: "",
    zipcode: "",
    phone: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (formData.accountId?.trim() === "") {
      newErrors.accountId = "Your Enterprise Account ID is required";
      isValid = false;
    } else {
      newErrors.accountId = "";
    }

    if (formData.zipcode?.trim() === "") {
      newErrors.zipcode = "Your Zipcode is required";
      isValid = false;
    } else {
      newErrors.zipcode = "";
    }

    if (formData.phone?.trim() === "") {
      newErrors.phone = "Your Phone is required";
      isValid = false;
    } else {
      newErrors.phone = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Verify this information with the backend (TBD). For now, just assume it's correct
      setStatus({ open: true, type: "success", message: "Verification successful. Your Digital Address has been verified" });
      // Navigate to the login page
      setTimeout(() => {
        navigate("/register"+location.search, { state: { method: "da", tab: 1, verifySuccess: true  } });
      }, 2 * 1000);
    }
  };

  const handleCancel = (e) => {
    navigate("/register"+location.search, { state: { method: "da", tab: 1, verifySuccess: false  } });
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
            subheader="Please provide information to help us verify your identity."
            subheaderTypographyProps={{ variant: "body1" }}
            sx={{ textAlign: "center" }}
          />

          <CardContent >
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Box width="50%" boxShadow={1} p={2}>
                  <Typography variant="body1" fontWeight={"bold"}>
                    Account ID
                  </Typography>
                  <TextField
                    name="accountId"
                    label="Your Enterprise Account ID"
                    required
                    fullWidth
                    variant="standard"
                    value={formData.accountId ?? ""}
                    onChange={(e) => handleFormChange(setFormData, e)}
                    error={!!errors.accountId}
                    helperText={errors.accountId}
                  />
                  <Typography variant="body1" fontWeight={"bold"} mt={2}>
                    Zipcode
                  </Typography>
                  <TextField
                    name="zipcode"
                    label="Zipcode"
                    required
                    fullWidth
                    variant="standard"
                    value={formData.zipcode ?? ""}
                    onChange={(e) => handleFormChange(setFormData, e)}
                    error={!!errors.zipcode}
                    helperText={errors.zipcode}
                  />
                  <Typography variant="body1" fontWeight={"bold"} mt={2}>
                    Your Phone Number
                  </Typography>
                  <TextField
                    name="phone"
                    label="Phone Number"
                    required
                    fullWidth
                    variant="standard"
                    value={formData.phone ?? ""}
                    onChange={(e) => handleFormChange(setFormData, e)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 2,
                    gap: 2,
                  }}
                >
                  <Button startIcon={<Cancel />} variant="outlined" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button startIcon={<Verified />} variant="contained" color="primary" type="submit">
                    Verify
                  </Button>


                </Box>
              </Box>
            </form>

          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
