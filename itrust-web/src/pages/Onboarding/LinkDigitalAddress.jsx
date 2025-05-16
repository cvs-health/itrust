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

import { Box, Button, Card, CardActions, CardContent, CardHeader, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import { useLocation, useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";

const useStyles = makeStyles((theme) => ({
    instructions: {
        marginTop: 1,
        marginBottom: 1,
        paddingBottom: 2,
        fontStyle: "italic",
    },
}));

export default function LinkDigitalAddress({ invitation, registrationComplete, setStatus }) {
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const navigate = useNavigate();
    const queryString = useLocation().search;


    // Step functions
    const stepContent = [
        "A Digital Address is a unique identifier for you. It is a globally unique for identifying and communicating with your connections like friends, family, and businesses.",
        "Your identity is important to us. Please check your Authenticator App and verify your identity.",
        "That's it! You're all set! You can now use your Digital Address to connect with others.",
    ];
    const [activeStep, setActiveStep] = useState(0);
    const steps = ["Scan Code", "Verify Identity", "Complete"];

    const handleCancel = (e) => {
        navigate(`/register${queryString}`, { state: { refresh: Math.random() } });
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleNext = async () => {
        //console.log ("Active Step: ", activeStep, "Form Data: ", formData)
        setActiveStep(activeStep + 1);

        // Last step - save the person
        if (activeStep === steps.length - 1) {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        console.log('Submitting...')
        //registrationComplete(invitation, identity);
        // Navigate to the login page
        navigate("/");
    }

    return (
        <Card elevation={0} >
            <CardHeader title="Link your Digital Address" titleTypographyProps={{ color: "primary.main", variant: "headline" }} />
            <CardContent>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ marginTop: 4 }}>
                    {activeStep === steps.length ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "70vw",
                                height: "70vh",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <GridLoader color="#cc0404" />
                        </Box>
                    ) : (
                        <>
                            {/* <Typography className={classes.instructions}>{stepContent[activeStep]}</Typography> */}
                            {activeStep === 0 && (
                                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={4}>
                                    <QRCode value="https://cvs.com" size={128} />
                                    <Typography variant="body1">
                                        Scan the QR Code with your Authenticator application
                                    </Typography>
                                </Box>
                            )}
                            {activeStep === 1 && (
                                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={4}>
                                    <Typography variant="body1">
                                        Please check your Authenticator App and verify your identity.
                                    </Typography>
                                </Box>
                            )}
                            {activeStep === 2 && (
                                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={4}>
                                    <Typography variant="body1">
                                        That's it! You're all set! You can now use your Digital Address to connect with others.
                                    </Typography>
                                </Box>
                            )}

                        </>
                    )}
                </Box>
            </CardContent>
            <CardActions
                //disableSpacing
                sx={{
                    alignSelf: "stretch",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    paddingRight: 4,
                }}
            >
                <Button variant="standard" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button disabled={activeStep === 0} onClick={handleBack} >
                    Back
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
            </CardActions>
        </Card>
    );
}
