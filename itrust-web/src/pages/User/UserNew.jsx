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

import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import { Reply } from '@mui/icons-material';
import { updateIdentity } from '../../services/MockDataService';

export default function UserNew() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const { state } = useLocation();
    const { identity } = { ...state };

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
    });
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
    });

    useEffect(() => {
        if (identity) {
            setFormData(identity);
        }
    }
        , [identity]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (formData.firstName.trim() === "") {
            newErrors.firstName = "First Name is required";
            isValid = false;
        } else {
            newErrors.firstName = "";
        }

        // Validate name field
        if (formData.lastName.trim() === "") {
            newErrors.lastName = "Last Name is required";
            isValid = false;
        } else {
            newErrors.lastName = "";
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        setError(null);
        try {
            if (validateForm()) {
                // Form is valid, submit or perform further actions
                console.log ("Form Data: ", formData)
                const response = await updateIdentity(formData.ID, formData)
                // const tenant = transformData(formData);
                // const response = tenant?.ID ? await updateTenant(tenant.ID, tenant) : await saveTenant(tenant);
                setStatus({
                    open: true,
                    type: "success",
                    message: "Updated user details",
                });
            }
            setError(null);

            navigate(-1, { state: { refresh: Math.random() } });
        } catch (err) {
            console.log(err);
            setError(err);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card elevation={0}>
                <CardHeader
                    title={identity ? `${identity?.firstName} ${identity?.lastName} Details` : "Define new user"}
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>{identity ? "View" : "Create"} identity information</Typography>
                        </Box>
                    }
                    action={
                        <>
                            <Button startIcon={<Reply />} onClick={handleBack} color="warning">
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
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
                            <Box display='flex' flexDirection='column' gap={2} width='48%'>
                                <TextField
                                    name="firstName"
                                    label="First Name"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.firstName ?? ""}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                />
                                <TextField
                                    name="lastName"
                                    label="Last Name"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.lastName ?? ""}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                />
                                <TextField
                                    name="dateOfBirth"
                                    label="Date of Birth"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.dateOfBirth ?? ""}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    error={!!errors.dateOfBirth}
                                    helperText={errors.dateOfBirth}
                                />
                                <TextField
                                    name="country"
                                    label="Country"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.country ?? ""}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    error={!!errors.country}
                                    helperText={errors.country}
                                />
                                <TextField
                                    name="email"
                                    label="Email"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.email ?? ""}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                />
                                <TextField
                                    name="phone"
                                    label="Phone"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.phone ?? ""}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                />
                            </Box>
                            <Box display='flex' flexDirection='column' gap={2} width='48%'>
                                <TextField
                                    name="identityType"
                                    label="Identity Type"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.identityType ?? ""}
                                    onChange={(e) => setFormData({ ...formData, identityType: e.target.value })}
                                    error={!!errors.identityType}
                                    helperText={errors.identityType}
                                />
                                <TextField
                                    name="street"
                                    label="Street"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.street ?? ""}
                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    error={!!errors.street}
                                    helperText={errors.street}
                                />
                                <TextField
                                    name="city"
                                    label="City"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.city ?? ""}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    error={!!errors.city}
                                    helperText={errors.city}
                                />
                                <TextField
                                    name="state"
                                    label="State"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.state ?? ""}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    error={!!errors.state}
                                    helperText={errors.state}
                                />
                                <TextField
                                    name="zipcode"
                                    label="Zipcode"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.zipcode ?? ""}
                                    onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                                    error={!!errors.zipcode}
                                    helperText={errors.zipcode}
                                />

                            </Box>
                        </Box>
                    </form>
                </CardContent>
                <CardActions
                    //disableSpacing
                    sx={{
                        alignSelf: "stretch",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Button onClick={handleBack}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Save
                    </Button>
                </CardActions>
            </Card>


        </Box>
    )
}
