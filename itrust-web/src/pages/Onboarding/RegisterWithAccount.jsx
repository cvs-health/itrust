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

import { Alert, Box, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormHelperText, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AppRegistration } from "@mui/icons-material";
import { isAfter, parseISO, set } from "date-fns";
import { handleFormChange } from "../../utils/FormUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { registerWithAccount } from "../../services/InvitationService";

export default function RegisterWithAccount({ invitation, registrationComplete, setStatus }) {
    const navigate = useNavigate();
    const [businessError, setBusinessError] = useState(false);
    // Get the query string from the url 
    const queryString = useLocation().search;

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        terms: false,
    });

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        terms: "",
    });

    useEffect(() => {
        console.log ("Invitation: ", invitation);
        if (invitation) {
            setFormData({
                ...formData,
                firstName: invitation.referenceData?.to?.firstName,
                lastName: invitation.referenceData?.to?.lastName,
                //email: invitation.referenceData?.to?.email,
            });
        }
    }, []);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        // Validate firstName field
        if (formData.firstName?.trim() === "") {
            newErrors.firstName = "First name is required";
            isValid = false;
        } else {
            newErrors.firstName = "";
        }

        // Validate lastName field
        if (formData.lastName?.trim() === "") {
            newErrors.lastName = "Last name is required";
            isValid = false;
        } else {
            newErrors.lastName = "";
        }

        // Validate email field
        if (formData.email?.trim() === "") {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        } else {
            newErrors.email = "";
        }

        // Validate password field
        if (formData.password?.trim() === "") {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        } else {
            newErrors.password = "";
        }

        // Validate terms checkbox
        if (!formData.terms) {
            newErrors.terms = "You must accept the terms and conditions";
            isValid = false;
        } else {
            newErrors.terms = "";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (invitation) {
        //     copyFormData(setFormData, formData, invitation);
        // }
        //console.log ("Form data: ", formData);
        if (validateForm()) {
            // Catch the error and show errors
            evaluateBusinessRules();
            console.log("Invitation code: ", invitation.invitationCode);
            await registerWithAccount(formData, invitation.invitationCode);

            // Indicate registration is complete
            registrationComplete(); // no business rules have been found

            setStatus({ open: true, type: "success", message: "Registration successful. You can now login with your new account" });

            // Navigate to the login page
            setTimeout(() => {
                navigate("/");
            }, 2 * 1000);
        }
    };

    /**
     * Rule 1: Invitation is addressed to the correct person
     * Rule 2: Invitation is not expired
     * Rule 3: Invitation is not already completed
     * Other rules can be added as required
     */
    const evaluateBusinessRules = () => {
        // Email is not addressed to this person
        if (formData.email && formData.email !== invitation?.referenceData?.to?.email) {
            setTimeout(() => {
                setBusinessError(true);
            }, 1 * 1000);
            return (
                <Alert severity="error">
                    <Typography gutterBottom>The invitation does not seem to be addressed to you. </Typography>
                    <Typography>
                        If you are using a different email, please contact your Administrator and request a new invitation to your registered email "
                        {formData.email}"
                    </Typography>
                </Alert>
            );
        } else if (isAfter(new Date(), parseISO(invitation?.expirationDate))) {
            setTimeout(() => {
                setBusinessError(true);
            }, 1 * 1000);
            return (
                <Alert severity="error">
                    <Typography gutterBottom>The invitation you are using has expired.</Typography>
                    <Typography>
                        Please check your email for the relevant invitation code. If you are not sure or seek a different operation, please contact
                        your Administrator and request a new invitation.
                    </Typography>
                </Alert>
            );
        } else if (invitation.completed) {
            setTimeout(() => {
                setBusinessError(true);
            }, 1 * 1000);
            return (
                <Alert severity="info">
                    <Typography gutterBottom>You have already accepted the invitation.</Typography>
                    <Typography>
                        If you are not sure or seek a different operation, please contact your Administrator and request a new invitation.
                    </Typography>
                </Alert>
            );
        } else {
            setTimeout(() => {
                setBusinessError(false);
            }, 1 * 1000);
        }
    };

    const copyFormData = (setFormData, formData, invitation) => {
        setFormData({
            ...formData,
            firstName: invitation.referenceData?.to?.firstName,
            lastName: invitation.referenceData?.to?.lastName,
            email: invitation.referenceData?.to?.email,
            password: formData.password,
            terms: formData.terms,
        });
    };

    const handleCancel = (e) => {
        navigate(`/register${queryString}`, { state: { refresh: Math.random() } });
    };

    return (
        <Card elevation={0}>
            <CardHeader title={invitation?.title} titleTypographyProps={{ color: "primary.main", variant: "headline" }} />
            <CardContent>
                {invitation && (
                    <form onSubmit={handleSubmit}>
                        <Box>
                            {evaluateBusinessRules()}

                            <Typography variant="body1" fontWeight={"bold"}>
                                Name
                            </Typography>

                            <Typography variant="body1" gutterBottom>
                                {formData.firstName + " " + formData.lastName}
                            </Typography>

                            <Typography variant="body1" fontWeight={"bold"}>
                                Email
                            </Typography>
                            <TextField
                                name="email"
                                label="Your registered email"
                                required
                                fullWidth
                                variant="standard"
                                value={formData.email ?? ""}
                                onChange={(e) => handleFormChange(setFormData, e)}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                            <Typography variant="body1" fontWeight={"bold"}>
                                Password
                            </Typography>
                            <TextField
                                name="password"
                                label="Set your Password"
                                type="password"
                                required
                                //fullWidth
                                variant="standard"
                                value={formData.password ?? ""}
                                onChange={(e) => handleFormChange(setFormData, e)}
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                            <Box />
                            <FormControlLabel
                                sx={{ mt: 4 }}
                                control={
                                    <Checkbox
                                        name="terms"
                                        //checked={formData.terms}
                                        onChange={(e) => handleFormChange(setFormData, e)}
                                        color="primary"
                                    />
                                }
                                label="I accept the terms and conditions"
                            />
                            {errors.terms && <FormHelperText error>{errors.terms}</FormHelperText>}
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                marginTop: 2,
                                gap: 1
                            }}
                        >
                            <Button variant="standard" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button startIcon={<AppRegistration />} variant="contained" color="primary" type="submit">
                                Register
                            </Button>
                        </Box>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
