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
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Box, Button, Card, CardContent, CardHeader, Divider, Stack, TextField } from '@mui/material';
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import { Reply } from '@mui/icons-material';
import { handleFormChange } from '../../utils/FormUtils';
import { saveCVSUser } from '../../services/UserService';
import { addYears, formatISO, startOfDay } from 'date-fns';

export default function CVSId() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        profileId: "",
        passkey: {
            passkeyUserName: "",
            issueDate: "",
            expirationDate: "",
            authority: "",
            certificate: "",
            platform: "",
            osVersion: "",
        }
    });

    const [errors, setErrors] = useState({
        profileId: "",
        passkey: {
            passkeyUserName: "",
            issueDate: "",
            expirationDate: "",
            authority: "",
            certificate: "",
            platform: "",
            osVersion: "",
        }
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };
    
        if (formData.profileId.trim() === "") {
          newErrors.profileId = "Profile Id is required";
          isValid = false;
        } else {
          newErrors.profileId = "";
        }
        
        setErrors(newErrors);
        return isValid;
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);
        try {
          if (validateForm()) {
            
            const payload = {
                did: user?.did,
                digitalAddress: user?.digitalAddress,
                profileId: formData.profileId,
                passkey: {
                    passkeyUserName: formData.passkey.passkeyUserName,
                    issueDate: formData.passkey?.issueDate || formatISO(startOfDay(new Date())),
                    expirationDate: formData.passkey?.expirationDate || formatISO(startOfDay(addYears(new Date(), 1))),
                    authority: formData.passkey.authority,
                    certificate: formData.passkey.certificate,
                    platform: formData.passkey.platform,
                    osVersion: formData.passkey.osVersion,
                }
            }
            // console.log ('Save the Profile user: ', payload)
            const response = await saveCVSUser(payload)
            // console.log('Response: ', response)

            setStatus({
              open: true,
              type: "success",
              message: "Updated CVS Credentials",
            });
          }
          setIsPending(false);
          // navigate(-1, { state: { refresh: Math.random() } });
        } catch (err) {
          console.log(err);
          
          setIsPending(false);
        }
      }

    const handleBack = () => {
        navigate(-1);
    };

    return loading ? (
        <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="purple" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card elevation={0}>
                <CardHeader
                    title="CVS Identity"
                    titleTypographyProps={{ color: "primary.main", variant: "headline" }}
                    action={
                        <>
                            <Button startIcon={<Reply />} onClick={handleBack} color="info">
                                Back
                            </Button>
                        </>
                    }
                />
                <Divider />
            </Card>
            <Card>
                <CardContent>
                    <form>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Box display='flex' flexDirection='column' gap={2} width='48%'>
                                <TextField
                                    name="profileId"
                                    label="CVS Profile ID"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.profileId ?? ""}
                                    onChange={(e) => handleFormChange(setFormData, e)}
                                    error={!!errors.profileId}
                                    helperText={errors.profileId}
                                />
                                <TextField
                                    name="passkey.passkeyUserName"
                                    label="Passkey Username"
                                    fullWidth
                                    variant="standard"
                                    value={formData.passkey.passkeyUserName ?? ""}
                                    onChange={(e) => handleFormChange(setFormData, e)}
                                    error={!!errors.passkey.passkeyUserName}
                                    helperText={errors.passkey.passkeyUserName}
                                />
                                <TextField
                                    name="passkey.issueDate"
                                    label="Issue Date"
                                    fullWidth
                                    variant="standard"
                                    value={formData.passkey.issueDate ?? ""}
                                    onChange={(e) => handleFormChange(setFormData, e)}
                                    error={!!errors.passkey.issueDate}
                                    helperText={errors.passkey.issueDate}
                                />
                                <TextField
                                    name="passkey.expirationDate"
                                    label="Expiration Date"
                                    fullWidth
                                    variant="standard"
                                    value={formData.passkey.expirationDate ?? ""}
                                    onChange={(e) => handleFormChange(setFormData, e)}
                                    error={!!errors.passkey.expirationDate}
                                    helperText={errors.passkey.expirationDate}
                                />
                                <TextField
                                    name="passkey.authority"
                                    label="Authority"
                                    fullWidth
                                    variant="standard"
                                    value={formData.passkey.authority ?? ""}
                                    onChange={(e) => handleFormChange(setFormData, e)}
                                    error={!!errors.passkey.authority}
                                    helperText={errors.passkey.authority}
                                />
                                <TextField
                                    name="passkey.certificate"
                                    label="Certificate"
                                    fullWidth
                                    variant="standard"
                                    value={formData.passkey.certificate ?? ""}
                                    onChange={(e) => handleFormChange(setFormData, e)}
                                    error={!!errors.passkey.certificate}
                                    helperText={errors.passkey.certificate}
                                />
                                <TextField
                                    name="passkey.platform"
                                    label="Platform"
                                    fullWidth
                                    variant="standard"
                                    value={formData.passkey.platform ?? ""}
                                    onChange={(e) => handleFormChange(setFormData, e)}
                                    error={!!errors.passkey.platform}
                                    helperText={errors.passkey.platform}
                                />
                                <TextField
                                    name="passkey.osVersion"
                                    label="OS Version"
                                    fullWidth
                                    variant="standard"
                                    value={formData.passkey.osVersion ?? ""}
                                    onChange={(e) => handleFormChange(setFormData, e)}
                                    error={!!errors.passkey.osVersion}
                                    helperText={errors.passkey.osVersion}
                                />
                                <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                                    <Button onClick={handleBack}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                                        Save
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    )
}
