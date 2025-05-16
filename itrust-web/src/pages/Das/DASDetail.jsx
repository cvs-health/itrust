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

import { Alert, Box, Button, Card, CardContent, Stack, Tab, Tabs, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DAS_ADMIN_INVITE, DATE_FORMAT } from "../../constants";
import { findDASById, sendAdminInvite as sendDASAdminInvite } from "../../services/DASService";
import StatusMessage from "../../components/StatusMessage";
import * as Constants from "../../constants"
import DigitalAddressPanel from "../../components/DigitalAddressPanel";
import TabPanel from "../../components/TabPanel";
import { createDigitalAddress } from "../../services/DigitalAddressService";
import { useAuthContext } from "../../context/AuthContext";
import DASCredentialDetail from "./DASCredentialDetail";


export default function DASDetail(props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
                
    const { state } = useLocation();
    const { refresh } = { ...state };
    let { id: dasId } = useParams();
    const [das, setDas] = useState();

    const [tab, setTab] = useState(0);
    const [showDAPanel, setShowDAPanel] = useState(false);
    const [creatingDA, setCreatingDA] = useState(false);
    const [disableDA, setDisableDA] = useState(true);
    const { user } = useAuthContext();

    useEffect(() => {
        async function getDas(dasId) {
            setLoading(true);
            // Check if das id is provide
            let found = null;
            if (dasId) {
                found = await findDASById(dasId);
            } else if (props.das) {
                found = props.das
            }
            // console.log ("Found DAS: ", found)
            if (found?.organization?.digitalAddress) {
                setShowDAPanel(true);
            }
            setDas(found);
            if (!found) {
                setStatus({ open: true, type: "info", message: "No DAS found" });
            }
            setLoading(false);
        }
        getDas(dasId);

        // If user is a DAS Admin and DAS admin is initialized 
        if ( (user?.dasId && user?.das?.organization?.did) || (user?.tenantId && user?.tenant?.organization?.did)) {
            setDisableDA(false);
        }

    }, [user, dasId, refresh]);

    const handleTabChange = (event, index) => {
        setTab(index);
    };

    const handleSendInvitation = async () => {
        console.log('Send invitation to: ', das?.primaryContact?.email);
        const payload = {
            type: DAS_ADMIN_INVITE,
            dasId: das?.ID,
            contactId: das?.primaryContact?.ID,
            email: das?.primaryContact?.email,
        };

        //console.log ("Payload: ", payload);
        await sendDASAdminInvite(payload);
        setStatus({ open: true, type: "success", message: "Invitation sent" });
    }

    const handleCreateDigitalAddress = async() => {
        setCreatingDA(true);
        const payload = {
            "entityType": Constants.ET_ORGANIZATION,
            "businessName": das?.organization?.name,
            "countryOfIncorporation": das?.organization?.countryOfIncorporation,
            "dateOfIncorporation": das?.organization?.dateOfIncorporation,
            "stateOfIncorporation": das?.organization?.stateOfIncorporation,
            "identifier": das?.identifier,
            "callback": {
                "isDAS": true,
                "type": "REST",
                "url": Constants.EXTERNAL_CALLBACK_API+"/api/v1/mock/identities",
                "dasId": das?.ID,
                "email": das?.primaryContact?.email,
                "phone": das?.primaryContact?.phone?.work || das?.primaryContact?.phone?.home || "",
            },
        }
        console.log ('DAS Payload: ', payload)
        const response = await createDigitalAddress(payload)

        das.organization.digitalAddress = response.entityDigitalAddress
        das.organization.did = response.entityDID
        // Save the DAS 
        //const updated = await updateDAS(das.ID, das)
        
        setDas(das)
        setShowDAPanel(true);
        setTimeout(() => {
            setCreatingDA(false);
        }, 1 * 1000);
    }

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card>
                <CardContent>
                    <Tabs value={tab} onChange={handleTabChange} aria-label="Tenant Details" indicatorColor="secondary">
                        <Tab label="General" />
                        <Tab label="Contact" />
                        <Tab label="Credentials" />
                    </Tabs>
                    {tab === 0 && (
                        <TabPanel>
                            <Box sx={{ display: "flex", flexDirection: "row" }}>
                                <Box sx={{ display: "flex", flexDirection: "column" }} width="25%">
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Name
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {das?.organization?.name || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Identifier
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {das?.identifier || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        DBA
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {das?.organization?.dba || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        TaxId
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {das?.organization?.taxId || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Date of Incorporation
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {(das?.organization?.dateOfIncorporation && format(parseISO(das?.organization?.dateOfIncorporation), DATE_FORMAT)) ||
                                            "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        State of Incorporation
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {das?.organization?.stateOfIncorporation || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Country of Incorporation
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {das?.organization?.countryOfIncorporation || "N.A."}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", flexDirection: "column" }} width="25%">
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Address
                                    </Typography>
                                    {(das?.organization?.address && (
                                        <>
                                            <Typography variant="body1">{das?.organization?.address?.addressLine1}</Typography>
                                            <Typography variant="body1" gutterBottom>
                                                {das?.organization?.address?.city} {das?.organization?.address?.state?.code} {das?.organization?.address?.zipcode}
                                            </Typography>
                                        </>
                                    )) || (
                                            <Typography variant="body1" gutterBottom>
                                                N.A.
                                            </Typography>
                                        )}

                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Phone
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {das?.organization?.phone?.main || "N.A."} {das?.organization?.phone?.extension || ""}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Website
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {das?.organization?.website || "N.A."}
                                    </Typography>
                                </Box>
                                <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center" width="50%" gap={2}>
                                    {showDAPanel && (
                                        <DigitalAddressPanel identity={das?.organization} loading={creatingDA} />
                                    )}
                                    {!showDAPanel && (
                                        <>
                                            <Typography variant="headline">
                                                Create a Digital Address for {das?.organization?.name}
                                            </Typography>
                                            <Stack direction="row" spacing={2}>
                                                <Button variant="contained" sx={{ width: '16em', height: '8em', fontSize: '1em' }} onClick={handleCreateDigitalAddress} disabled={ !disableDA}>Create Digital Address</Button>
                                                <Button variant="contained" sx={{ width: '16em', height: '8em', fontSize: '1em' }} onClick={handleSendInvitation} disabled={ disableDA}> Invite to Register</Button>
                                            </Stack>
                                            {disableDA && (
                                                <Alert severity="error" sx={{ mb: 4 }}>
                                                You must initialize your DAS before sending an invitation. To create Digital Address for your organization, please go to <Link to="/das/my_das">My DAS</Link> under your profile.
                                            </Alert>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </TabPanel>
                    )}
                    {tab === 1 && (
                        <TabPanel>
                            <Box sx={{ display: "flex", flexDirection: "column" }} width="30%">
                                <Typography variant="body1" fontWeight={"bold"}>
                                    Contact Name
                                </Typography>
                                {(das?.primaryContact && (
                                    <Typography variant="body1" gutterBottom>
                                        {das?.primaryContact?.firstName} {das?.primaryContact?.lastName}
                                    </Typography>
                                )) || (
                                        <Typography variant="body1" gutterBottom>
                                            N.A.
                                        </Typography>
                                    )}
                                <Typography variant="body1" fontWeight={"bold"}>
                                    Address
                                </Typography>
                                {(das?.primaryContact?.address && (
                                    <>
                                        <Typography variant="body1">{das?.primaryContact?.address?.addressLine1}</Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {das?.primaryContact?.address?.city} {das?.primaryContact?.address?.state.code} {das?.primaryContact?.address?.zipCode}
                                        </Typography>
                                    </>
                                )) || (
                                        <Typography variant="body1" gutterBottom>
                                            N.A.
                                        </Typography>
                                    )}

                                <Typography variant="body1" fontWeight={"bold"}>
                                    Phone
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {das?.person?.phone?.work || "N.A."}
                                </Typography>
                            </Box>
                        </TabPanel>
                    )}
                    {tab === 2 && (
                        <DASCredentialDetail das={das} setStatus={setStatus} />
                        )}
                </CardContent>
            </Card>
        </Box>
    );
}
