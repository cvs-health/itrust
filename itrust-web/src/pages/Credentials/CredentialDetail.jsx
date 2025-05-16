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

import { Cancel, PersonRemove } from '@mui/icons-material';
import { Alert, Box, Button, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { GridLoader } from 'react-spinners';
import { findCredentialSchemaById } from '../../services/CredentialSchemaService';
import { findCredentialByCredentialId } from '../../services/DigitalAddressService';
import { format, parseISO } from 'date-fns';
import { DATE_FORMAT } from '../../constants';

export default function CredentialDetail({ credentialMetadata, setShowDetails, handleRevoke }) {
    const [loading, setLoading] = useState(false);
    const [credentialSchema, setCredentialSchema] = useState();
    const [credential, setCredential] = useState({});

    useEffect(() => {
        async function getCredentialSchema() {
            try {
                const schema = await findCredentialSchemaById(credentialMetadata.credentialSchema.ID);
                setCredentialSchema(schema);
            } catch (error) {
                console.error("Error fetching Credential Schema", error);
                setLoading(false);
            }
        }
        async function getCredential() {
            try {
                const credential = await findCredentialByCredentialId(credentialMetadata.credentialId);
                const vals = JSON.parse(credential.credentialBlob)
                setCredential(vals);
            } catch (error) {
                console.error("Error fetching Credential", error);
                setLoading(false);
            }
        }

       // console.log('Credential Metadata: ', credentialMetadata)
        setLoading(true);
        getCredentialSchema()
        getCredential()
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    return loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", width: "50vw", height: "70vh", justifyContent: "center", alignItems: "center" }}>
            <GridLoader color="#cc0404" />
            <Typography variant="body1" mt={4}>
                Getting credential details ...
            </Typography>
        </Box>
    ) : (
        <Card elevation={0}>
            <CardHeader
                title={credentialMetadata?.credentialSchema?.name}
                titleTypographyProps={{ color: "primary.main", variant: "title" }}
                subheader={`${credentialMetadata?.credentialSchema?.credentialTypes?.map((ct) => ct.name).join(", ")} Credential`}
                action={
                    <>
                        <Button startIcon={<PersonRemove />} onClick={() => handleRevoke(credentialMetadata)} color="primary" disabled={credentialMetadata?.revoked}>
                            Revoke
                        </Button>
                        <Button startIcon={<Cancel />} color="warning" onClick={() => setShowDetails(false)}>
                            Close
                        </Button>
                    </>
                }
            />
            <CardContent>
                {credentialMetadata?.revoked &&
                    <Alert severity="error" sx={{mb: 4 }}>
                        This credential has been revoked. You can no longer use it to verify your claims
                    </Alert>
                }

                <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" flexDirection="column">
                        <Typography variant="headline" color="primary" >
                            Issuer
                        </Typography>
                        <Divider />
                        <Typography variant="subtitle1" >
                            Name
                        </Typography>
                        <Typography variant="body1" color="primary" gutterBottom>
                            {credentialMetadata?.issuerName}
                        </Typography>
                        <Typography variant="subtitle1" >
                            Digital Address
                        </Typography>
                        <Typography variant="body1" color="primary" gutterBottom>
                            {credentialMetadata?.issuerDigitalAddress}
                        </Typography>
                        <Typography variant="subtitle1" >
                            DID
                        </Typography>
                        <Typography variant="body1" color="primary" gutterBottom>
                            {credentialMetadata?.issuerDID}
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column">
                        <Typography variant="headline" color="primary" >
                            Issued To
                        </Typography>
                        <Divider />
                        <Typography variant="subtitle1" >
                            Name
                        </Typography>
                        <Typography variant="body1" color="primary" gutterBottom>
                            {credentialMetadata?.entityName}
                        </Typography>
                        <Typography variant="subtitle1" >
                            Digital Address
                        </Typography>
                        <Typography variant="body1" color="primary" gutterBottom>
                            {credentialMetadata?.entityDigitalAddress}
                        </Typography>
                        <Typography variant="subtitle1" >
                            DID
                        </Typography>
                        <Typography variant="body1" color="primary" gutterBottom>
                            {credentialMetadata?.entityDID}
                        </Typography>
                    </Box>

                    <Box display="flex" flexDirection="column">
                        <Typography variant="headline" color="primary" >
                            Credential Type(s)
                        </Typography>
                        <Divider />
                        <Typography variant="body1" color="primary" gutterBottom>
                            {credentialSchema?.credentialTypes.map((ct) => ct.name).join(", ")}
                        </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column">
                        <Typography variant="headline" color="primary" >
                            Attributes
                        </Typography>

                        <Divider />
                        {
                            credentialSchema?.attributes
                                .sort((a, b) => a.order - b.order)
                                .map((attr, index) => (
                                    <Box key={index}>
                                        <Typography variant="subtitle1" >
                                            {attr.displayName}
                                        </Typography>
                                        <Typography variant="body1" color="primary" gutterBottom>
                                            {
                                                credential[attr.name] ?
                                                    (attr.Datatype === 'Date' ? format(parseISO(credential[attr.name]), DATE_FORMAT) : credential[attr.name])
                                                    : 'N/A'}
                                        </Typography>
                                    </Box>
                                ))
                        }
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="flex-start" mt={2}>
                        <Typography variant="headline" color="primary" >
                            Audit
                        </Typography>
                        <Divider />
                        <Typography variant="subtitle1" >
                            Issued On
                        </Typography>
                        <Typography variant="body1" color="primary" gutterBottom>
                            {format(parseISO(credentialMetadata.CreatedAt), DATE_FORMAT)}
                        </Typography>
                        <Typography variant="subtitle1" >
                            Revoked
                        </Typography>
                        <Typography variant="body1" color="primary" gutterBottom>
                            {credentialMetadata.revoked ? "Yes" : "No"}
                        </Typography>
                        {credentialMetadata.revoked && (
                            <>
                                <Typography variant="subtitle1" >
                                    Revoked On
                                </Typography>
                                <Typography variant="body1" color="primary" gutterBottom>
                                    {format(parseISO(credentialMetadata.revokedOn), DATE_FORMAT)}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </CardContent>

        </Card>
    )
}
