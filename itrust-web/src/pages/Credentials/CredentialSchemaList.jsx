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

import { Box, Button, Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CredentialSchemaTable from "./CredentialSchemaTable";
import { GridLoader } from "react-spinners";
import { Reply } from "@mui/icons-material";
import StatusMessage from "../../components/StatusMessage";
import { findCredentialSchemas } from "../../services/CredentialSchemaService";

export default function CredentialSchemaList() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const [credentialSchemas, setCredentialSchemas] = useState([]);
    const { state } = useLocation();
    const { refresh } = { ...state };

    useEffect(() => {
        async function getCredentialSchemas() {
            setLoading(true);
            const results = await findCredentialSchemas();
            setCredentialSchemas(results);
            setLoading(false);
        }

        getCredentialSchemas();
    }, [refresh]);

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
            <Card>
                <CardHeader
                    title="Credential Schemas"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>
                                Credential Schemas are a set of rules that define the structure of a credential. The schema includes the names of the attributes that are included in the credential, the data types of each attribute, and any restrictions on the data.
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
                <CardContent>{credentialSchemas && <CredentialSchemaTable credentialSchemas={credentialSchemas} setCredentialSchemas={setCredentialSchemas}/>}</CardContent>
            </Card>
        </Box>
    );
}
