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
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { completeInvitation, findInvitationByCode, updateInvitation } from "../../services/InvitationService";
import { GridLoader } from "react-spinners";

import RegisterInfo from "./RegisterInfo";
import RegisterWithAccount from "./RegisterWithAccount";
import RegisterWithDigitalAddress from "./RegisterWithDigitalAddress";
import LinkDigitalAddress from "./LinkDigitalAddress";
import StatusMessage from "../../components/StatusMessage";


export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(false);
    const [invitation, setInvitation] = useState({});
    const [code, setCode] = useState(params.get("code"));


    // Ways to register
    const [showRegistrationMethods, setShowRegistrationMethods] = useState(true);
    const [optAccount, setOptAccount] = useState(params.get("acc") === "false" ? false : true);
    const [optDA, setOptDA] = useState(params.get("da") === "false" ? false : true);
    const [optLinkDA, setOptLinkDA] = useState(params.get("linkda") === "false" ? false : true);

    const [showAccount, setShowAccount] = useState(false);
    const [showDA, setShowDA] = useState(false);
    const [showLinkDA, setShowLinkDA] = useState(false);

    // Status message 
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });

    // Navigate to the correct location based on state 
    const { state } = useLocation();
    const { method, tab, verifySuccess, refresh, verifiedData } = { ...state };


    useEffect(() => {
        async function getInvitationsByCode() {
            setLoading(true);
            if (code) {
                const inv = await findInvitationByCode(code);
                //console.log ("Invitation: ", inv);
                if (inv?.data) {
                    inv.data = JSON.parse(inv.data);
                }

                setInvitation(inv);
            } else {
                navigate("/");
            }
            setLoading(false);
        }
        getInvitationsByCode();

        //console.log ('Method: ', method, ' Tab: ', tab)
        if (method) {
            handleRegistrationMethod(method);
        }
        if (refresh)
            setShowRegistrationMethods(true);

    }, [refresh]);



    const handleCancel = (e) => {
        navigate(-1);
    };

    const handleRegistrationMethod = (method) => {
        if (method === "acc") {
            setShowRegistrationMethods(false);
            setShowAccount(true);
            setShowDA(false);
            setShowLinkDA(false);
        } else if (method === "da") {
            setShowRegistrationMethods(false);
            setShowAccount(false);
            setShowDA(true);
            setShowLinkDA(false);
        } else if (method === "linkDA") {
            setShowRegistrationMethods(false);
            setShowAccount(false);
            setShowDA(false);
            setShowLinkDA(true);
        }
    };

    const registrationComplete = async(inv, identity) => {
        console.log("Invitation: ", inv);
        // Update the invitation with the identity
        inv.toPartyDID = identity?.did;
        inv = await updateInvitation(inv.ID, inv);
        inv = await completeInvitation(inv.ID);
        setInvitation(inv);


        setShowRegistrationMethods(true);
        setShowAccount(false);
        setShowDA(false);
        setShowLinkDA(false);
    };

    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" height="100vh">
            <StatusMessage status={status} changeStatus={setStatus} />
            <Box display="flex" flexDirection="column" bgcolor={"#cc0404"} width="30%">
                <RegisterInfo />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" width="70%" bgcolor={"black"}>
                <Card elevation={0} sx={{ width: "100%" }}>
                    <CardHeader
                        title="Sign up your account"
                        titleTypographyProps={{ color: "primary.main", variant: "title" }}
                        subheader={showRegistrationMethods ? "Please select your registration method" : ""}
                        subheaderTypographyProps={{ variant: "body1" }}
                        sx={{ textAlign: "center" }}
                    />

                    <CardContent>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
                            {showRegistrationMethods && (
                                <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent={"center"} gap={1}>
                                    {optAccount && (
                                        <Card sx={{ width: "30%", backgroundColor: "secondary.main", color: "white", cursor: "pointer" }} elevation={4} onClick={() => handleRegistrationMethod("acc")}>
                                            <CardHeader
                                                title="Register with an account/ password"
                                                titleTypographyProps={{ color: "white", variant: "headline", textAlign: "center" }}
                                                subheader="Assurance Level 1"
                                                subheaderTypographyProps={{ color: "lightgrey", variant: "subtitle1", textAlign: "center" }}
                                            />
                                            <CardContent>
                                                <Typography variant="body1">Confirm your identity and create your account using your email and password. You can create other options to login after authentication.</Typography>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {optDA && (
                                        <Card sx={{ width: "30%", backgroundColor: "primary.main", color: "white", cursor: "pointer" }} elevation={4} onClick={() => handleRegistrationMethod("da")}>
                                            <CardHeader
                                                title="Create or Link your Digital Address"
                                                titleTypographyProps={{ color: "white", variant: "headline", textAlign: "center" }}
                                                subheader="Assurance Level 2/3"
                                                subheaderTypographyProps={{ color: "lightgrey", variant: "subtitle1", textAlign: "center" }}
                                            />
                                            <CardContent>
                                                <Typography variant="body1">
                                                    Confirm your identity and create your Digital Address. You can set your preferred option to always authenticate
                                                    using your Digital Address and never use your password again.
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {optLinkDA && (
                                        <Card sx={{ width: "30%", backgroundColor: "secondary.main", color: "white", cursor: "pointer" }} elevation={4} onClick={() => handleRegistrationMethod("linkDA")}>
                                            <CardHeader
                                                title="Link your Digital Address"
                                                titleTypographyProps={{ color: "white", variant: "headline", textAlign: "center" }}
                                                subheader="Assurance Level 3"
                                                subheaderTypographyProps={{ color: "lightgrey", variant: "subtitle1", textAlign: "center" }}
                                            />
                                            <CardContent>
                                                <Typography variant="body1">
                                                    If you have an existing Digital Address, you can link it to your account. You will have to verify with your
                                                    credentials when prompted.
                                                </Typography>

                                            </CardContent>
                                        </Card>
                                    )}
                                </Box>
                            )}
                            {!showRegistrationMethods && (
                                <Box display="flex" flexDirection="column">
                                    {showAccount && (
                                        <RegisterWithAccount invitation={invitation} registrationComplete={registrationComplete} setStatus={setStatus} verifySuccess={verifySuccess} />
                                    )}
                                    {showDA && (
                                        <RegisterWithDigitalAddress invitation={invitation} registrationComplete={registrationComplete} setStatus={setStatus} tab={tab} verifySuccess={verifySuccess} verifiedData={verifiedData} />
                                    )}
                                    {showLinkDA && <LinkDigitalAddress invitation={invitation} registrationComplete={registrationComplete} setStatus={setStatus} verifySuccess={verifySuccess} />}
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
