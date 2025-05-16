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

import { AppBar, Box, Button, Card, CardContent, CardHeader, Divider, Stack, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";
import StatusMessage from "../../components/StatusMessage";
import { AddCircle, RemoveCircle, Reply } from "@mui/icons-material";

export default function ConnectorsList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    // Use a CRUD for these connectors in the future
    const [connectors, setConnectors] = useState([
        {
            id: 1,
            name: "Caremark Workforce Identities",
            description: "Caremark Workforce Identities in Active Directory",
            type: "LDAP Connector",
            company: "Caremark",
            identityType: "Employee",
            idp: "AD",
        },
        {
            id: 2,
            name: "Caremark Customer Identities",
            description: "Caremark Customer Identities in Ping Federate",
            type: "LDAP Connector",
            company: "Caremark",
            identityType: "Customer",
            idp: "Ping",
        },
        {
            id: 3,
            name: "Caremark Partner Identities",
            description: "Caremark Partner Identities in Entra ID",
            type: "LDAP Connector",
            company: "Caremark",
            identityType: "Partner",
            idp: "Entra ID",
        },
        {
            id: 4,
            name: "Aetna Workforce Identities",
            description: "Aetna Workforce Identities in Active Directory",
            type: "LDAP Connector",
            company: "Aetna",
            identityType: "Employee",
            idp: "AD",
        },
        {
            id: 5,
            name: "Aetna Customer Identities",
            description: "Aetna Customer Identities in Ping Federate",
            type: "LDAP Connector",
            company: "Aetna",
            identityType: "Customer",
            idp: "Ping",
        },
        {
            id: 6,
            name: "Aetna Partner Identities",
            description: "Aetna Partner Identities in Entra ID",
            type: "LDAP Connector",
            company: "Aetna",
            identityType: "Partner",
            idp: "Entra ID",
        },
        {
            id: 7,
            name: "Minute Clinic Workforce Identities",
            description: "Minute Clinic Workforce Identities in Active Directory",
            type: "LDAP Connector",
            company: "Minute Clinic",
            identityType: "Employee",
            idp: "AD",
        },
        {
            id: 8,
            name: "Minute Clinic Customer Identities",
            description: "Minute Clinic Customer Identities in Ping Federate",
            type: "LDAP Connector",
            company: "Minute Clinic",
            identityType: "Customer",
            idp: "Ping",
        },
        {
            id: 9,
            name: "Minute Clinic Partner Identities",
            description: "Minute Clinic Partner Identities in Entra ID",
            type: "LDAP Connector",
            company: "Minute Clinic",
            identityType: "Partner",
            idp: "Entra ID",
        },
    ]);

    const handleBack = () => {
        navigate(-1);
    };
    const showIdentities = (id) => {
        console.log("id: ", id);
        const connector = connectors.find((connector) => connector.id === id);
        console.log("connector: ", connector);
        navigate(`/integrations/identities?company=${connector.company}&identityProvider=${connector.idp}&identityType=${connector.identityType}`);
    };

    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card>
                <CardHeader
                    title="Data Connectors"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader="Connect and synchronize your identity and credential information effortlessly. Set up data connectors to identity providers, databases, or SaaS providers of your choice."
                    action={
                        <>
                            <Button startIcon={<AddCircle />} onClick={handleBack} color="primary">
                                Add Connector
                            </Button>
                            <Button startIcon={<Reply />} onClick={handleBack} color="warning">
                                Back
                            </Button>
                        </>
                    }
                />
                <Divider />

                <CardContent>
                    {connectors && (
                        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
                            {connectors.map((connector) => (
                                <Card key={connector.id} sx={{ minWidth: "30%" }}>
                                    <CardHeader
                                        title={connector.name}
                                        titleTypographyProps={{ color: "primary.main", variant: "headline" }}
                                        subheader={connector.description}
                                        action={
                                            <>
                                                <RemoveCircle color="primary" />
                                            </>
                                        }
                                    />
                                    <Divider />
                                    <CardContent sx={{ cursor: "pointer" }} onClick={() => showIdentities(connector.id)}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                                            <Typography variant="subtitle1">Company</Typography>
                                            <Typography variant="body1">{connector.company}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                                            <Typography variant="subtitle1">Identity Type</Typography>
                                            <Typography variant="body1">{connector.identityType}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                                            <Typography variant="subtitle1">Connector Type</Typography>
                                            <Typography variant="body1">{connector.type}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                                            <Typography variant="subtitle1">Identity Provider</Typography>
                                            <Typography variant="body1">{connector.idp}</Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
