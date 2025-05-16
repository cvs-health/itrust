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

import { Box, Button, Card, CardContent, CardHeader, Divider, Drawer, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";
import { Reply } from "@mui/icons-material";
import StatusMessage from "../../components/StatusMessage";
import { searchCredentialMetadataByIssuer } from "../../services/CredentialMetadataService";
import CredentialMetadataTable from "./CredentialMetadataTable";
import { useAuthContext } from "../../context/AuthContext";
import CredentialDetail from "./CredentialDetail";

export default function CredentialMetadataList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const [credentialMetadatas, setCredentialMetadatas] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [credentialMetadata, setCredentialMetadata] = useState();

    const { state } = useLocation();
    const { refresh } = { ...state };
    const {user} = useAuthContext();


    useEffect(() => {
        async function getCredentialMetadatas() {
            setLoading(true);
            let issuerDid = user?.dasId ? user?.das?.organization.did: user?.tenant?.organization.did
            const results = await searchCredentialMetadataByIssuer(issuerDid);
            
            setCredentialMetadatas(results);
            setLoading(false);
        }

        getCredentialMetadatas();
    }, [user, refresh]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleShowDetails = (c) => {
        setCredentialMetadata(c);
        setShowDetails(true);
    }

    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card>
                <CardHeader
                    title="Verifiable Credentials Issued"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>
                                Verifiable Credentials issued by your organization
                            </Typography>
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
                <CardContent>{credentialMetadatas && <CredentialMetadataTable credentialMetadatas={credentialMetadatas} handleShowDetails={handleShowDetails}/>}</CardContent>
            </Card>

            <Drawer variant="temporary" anchor="right" open={showDetails} onClose={() => setShowDetails(false)}>
                <Box width="50vw" mt={8}>
                    <CredentialDetail credentialMetadata={credentialMetadata} setShowDetails={setShowDetails}/>
                </Box>
            </Drawer>
        </Box>
    );
}
