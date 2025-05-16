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

import { Box, Button, Card, CardActions, CardContent, CardHeader, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useLocation, useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";
import { generateVariableVerificationCode } from "../../utils/utils"
import * as Constants from "../../constants"
import { Business, Fingerprint, People } from "@mui/icons-material";
import { createDigitalAddress, linkDigitalAddress } from "../../services/DigitalAddressService";

const useStyles = makeStyles((theme) => ({
    instructions: {
        marginTop: 1,
        marginBottom: 1,
        paddingBottom: 2,
        fontStyle: "italic",
    },
}));

export default function RegisterWithDigitalAddress({ invitation, registrationComplete, setStatus, tab, verifySuccess, verifiedData }) {
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const navigate = useNavigate();

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const queryString = useLocation().search;

    const [did, setDid] = useState("")
    const [showDA, setShowDA] = useState(false);
    const [identity, setIdentity] = useState(null);


    useEffect(() => {
        // Dummy method. Will be replaced after actual implementation 
        const code = generateVariableVerificationCode(Constants.VERIFICATION_CODE_ALPHANUMERIC, 16, 16)
        const did = "did:adia:" + code.toLowerCase()
        setDid(did)

        if (tab) {
            setActiveStep(tab)
        }

    }, [verifiedData]);

    // Step functions
    const stepContent = [
        "Your Digital Address issuer has provided the following information. Please confirm the details are correct.",
        "Your identity is important to us. Verify using an approved method",
        "That's it! You're all set! You can now use your Digital Address to connect with others.",
    ];
    const [activeStep, setActiveStep] = useState(0);
    const steps = ["Confirm Information", "Verify Identity", "Complete"];

    const handleCancel = (e) => {
        navigate(`/register${queryString}`, { state: { refresh: Math.random() } });
    };


    const handleBack = () => {
        if (activeStep !== 1) {
            setShowDA(false)
        }
        setActiveStep(activeStep - 1);

    };

    const handleNext = async () => {
        console.log('Active Step: ', activeStep)
        if (activeStep === 1) {
            setLoading(true)
            console.log('verifiedData: ', verifiedData)

            if (verifiedData?.did) {
                console.log('User already has a DID: ', verifiedData?.did)
                const response = await handleLinkDigitalAddress()
                console.log('Response: ', response)
                // User already has a DID. Just display it
                setIdentity({
                    digitalAddress: verifiedData?.digitalAddress,
                    did: verifiedData?.did
                })

            } else {
                // Create a new Digital Address 
                // console.log('User does not have a DID. Create one')
                const response = await handleCreateDigitalAddress()
                // console.log('Response: ', response)
                setIdentity({
                    digitalAddress: response?.entityDigitalAddress,
                    did: response?.entityDID
                })
            }
            setShowDA(true)
            setLoading(false)
        }

        setActiveStep(activeStep + 1);

        // Last step - save the person
        if (activeStep === steps.length - 1) {
            await handleSubmit();
        }
    };

    const handleCreateDigitalAddress = async () => {
        const payload = {
            "entityType": Constants.ET_PERSON,
            "firstName": invitation?.data?.firstName,
            "lastName": invitation?.data?.lastName,
            "dateOfBirth": invitation?.data?.dateOfBirth,
            "country": invitation?.data?.country,
            "callback": {
                "type": "REST",
                "url": Constants.EXTERNAL_CALLBACK_API + "/api/v1/mock/identities",
                "externalId": invitation?.data?.id,
                "email": invitation?.toPartyEmail,
                "phone": invitation?.toPartyPhone,
                "invitationId": invitation?.ID,
                "privateIdGUID": verifiedData?.privateId
            },
        }
        return await createDigitalAddress(payload)
    }

    const handleLinkDigitalAddress = async () => {
        const payload = {
            "entityType": Constants.ET_PERSON,
            "firstName": invitation?.data?.firstName,
            "lastName": invitation?.data?.lastName,
            "callback": {
                "type": "REST",
                "url": Constants.EXTERNAL_CALLBACK_API + "/api/v1/mock/identities",
                "externalId": invitation?.data?.id,
                "invitationId": invitation?.ID,
                "digitalAddress": verifiedData?.digitalAddress,
                "did": verifiedData?.did,
            },
        }
        return await linkDigitalAddress(payload)
    }

    const handleSubmit = async () => {
        console.log("Invitation code: ", invitation.invitationCode);
        registrationComplete(invitation, identity);
        setStatus({ open: true, type: "success", message: "Registration successful. You can now login with your new account" });

        // Navigate to the User console page 
        setTimeout(() => {
            const userConsoleUrl = Constants.USER_CONSOLE_URL
            // redirect to the user console 
            window.location = userConsoleUrl
        }, 2 * 1000);
    }

    const handleIssuerVerification = async () => {
        // console.log (' Query String: ', location.search)
        // console.log ('Query Params: ', params)
        navigate("/digital_address/verify_issuer_info" + location.search)
    }

    const handleBiometricVerification = async () => {
        navigate("/digital_address/verify_biometric" + location.search)
    }

    const handleGovernmentVerification = async () => {
        navigate("/digital_address/verify_government_id" + location.search)
    }

    return (
        <Card elevation={0} >
            <CardHeader title="Create your Digital Address" titleTypographyProps={{ color: "primary.main", variant: "headline" }} />
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
                            <Typography className={classes.instructions}>{stepContent[activeStep]}</Typography>
                            {activeStep === 0 && (
                                <Box boxShadow={1} p={2}>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        First Name
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {invitation?.data?.firstName}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Last Name
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {invitation?.data?.lastName}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Date of Birth
                                    </Typography>
                                    <Typography variant="subtitle" gutterBottom>
                                        ********** (Hidden)
                                        {/* {format(parseISO(invitation?.data?.dateOfBirth), DATE_FORMAT)} */}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Country
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {invitation?.data?.country}
                                    </Typography>

                                </Box>
                                // <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={4}>

                                //     <QRCode value="https://cvs.com" size={128} />
                                //         <Typography variant="body1">
                                //             Scan the QR Code with your Authenticator application
                                //         </Typography>
                                // </Box>
                            )}
                            {activeStep === 1 && (
                                <Box boxShadow={1} p={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={4}>
                                    {verifySuccess && (
                                        <Typography variant="body1" color='success.main'>
                                            Verification Successful!
                                        </Typography>
                                    )}
                                    <Stack direction="row" spacing={2}>
                                        <Button startIcon={<Business />} variant="contained" color='secondary' sx={{ width: '20em', height: '8em', fontSize: '1em', display: "block" }} onClick={handleIssuerVerification}>
                                            <Typography variant="body1" fontWeight="bold">Verify with Issuer Information</Typography>
                                            <Typography variant="body1" color="lightgray">Assurancel Level 1</Typography>
                                        </Button>
                                        <Button startIcon={<Fingerprint />} variant="contained" color='secondary' sx={{ width: '20em', height: '8em', fontSize: '1em', display: "block" }} onClick={handleBiometricVerification}>
                                            <Typography variant="body1" fontWeight="bold">Biometric Registration</Typography>
                                            <Typography variant="body1" color="lightgray">Assurancel Level 2</Typography>

                                        </Button>
                                        <Button startIcon={<People />} variant="contained" color='secondary' sx={{ width: '20em', height: '8em', fontSize: '1em', display: "block" }} onClick={handleGovernmentVerification}>
                                            <Typography variant="body1" fontWeight="bold">Government Issued Identity</Typography>
                                            <Typography variant="body1" color="lightgray">Assurancel Level 3</Typography>

                                        </Button>
                                    </Stack>
                                </Box>
                            )}
                            {activeStep === 2 && showDA && (
                                <Box boxShadow={4} p={4} display="flex" flexDirection="row" justifyContent="center" alignItems="flex-start" gap={4}>
                                    <Box>
                                        <QRCode value="https://cvs.com" size={128} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" fontWeight={"bold"}>
                                            Digital Address
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {identity?.digitalAddress}
                                        </Typography>
                                        <Typography variant="body1" fontWeight={"bold"} pt={2}>
                                            DID
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {identity?.did}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            {activeStep === 2 && !showDA && (
                                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                    <Typography variant="subtitle1" mb={4}>
                                        Creating Digital Address...
                                    </Typography>
                                    <GridLoader color="#cc0404" />
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
