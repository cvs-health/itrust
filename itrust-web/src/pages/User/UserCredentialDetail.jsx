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

import { BrandingWatermark, ExpandCircleDown, PersonRemove, PlayCircle, Report } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardHeader, Divider, Drawer, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code';
import { GridLoader } from 'react-spinners';
import { getCredentialMetadata, revokeCredential } from '../../services/DigitalAddressService';
import { format, parseISO } from 'date-fns';
import { DATE_FORMAT } from '../../constants';
import CredentialDetail from '../Credentials/CredentialDetail';
import { useAuthContext } from '../../context/AuthContext';

export default function UserCredentialDetail({ identity, setStatus }) {
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [credentialMetadata, setCredentialMetadata] = useState();
    const { user } = useAuthContext();

    useEffect(() => {

        const fetchCredentialMetadata = async () => {
            setLoading(true);
            try {
                var issuerDid = ""
                var issuerDigitalAddress = ""
                if (user.tenantId) {
                    issuerDid = user?.tenant?.organization?.did;

                }

                const data = {
                    entityDigitalAddress: identity?.digitalAddress,
                    entityDid: identity?.did,
                    issuerDid: issuerDid
                }
                const metadata = await getCredentialMetadata(data);
                // console.log ('Credential Metadata: ', metadata)
                setCredentials(metadata);
                setLoading(false);
            } catch (error) {
                // console.error("Error fetching Credential Metadata", error);
                setLoading(false);
            }
        }
        // console.log ('Identity: ', identity)
        if (identity?.did) {
            fetchCredentialMetadata();
        }


    }, [identity]);


    const handleRevoke = async (c) => {
        console.log('Revoke credential Metadata: ', c)
        setCredentialMetadata(c);
        const response = await revokeCredential(identity.did, c.credentialId);
        if (response) {
            setStatus({ type: "success", message: "Credential revoked successfully" });
            setCredentials(credentials.map((credential) => {
                if (credential.credentialId === c.credentialId) {
                    credential.revoked = true;
                    credential.revokedDate = new Date();
                }
                return credential;
            }));
        }
    }

    const handleShowDetails = (c) => {
        setCredentialMetadata(c);
        setShowDetails(true);
    }

    return loading ? (
        <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
            {credentials && credentials.map((credential) => (
                <Card elevation={4} key={credential.ID} sx={{ width: { xs: '99%', sm: '49%', md: '32%', } }}>
                    <CardHeader
                        title={credential.issuerName}
                        titleTypographyProps={{ color: "primary.main", variant: "subtitle2" }}
                        // Get the credential.credentialSchema.credentialTypes array and create a Comma separated value of the credentialType name
                        subheader={credential.credentialSchema.name}
                        avatar={
                            <BrandingWatermark color="primary" />
                        }
                        action={
                            <>
                                {!credential.revoked && (
                                    <Button startIcon={<PersonRemove />} onClick={() => handleRevoke(credential)} color="primary">
                                        Revoke
                                    </Button>
                                )}
                                {credential.revoked && (
                                    <Button startIcon={<Report />} color="warning">
                                        Revoked
                                    </Button>
                                )}
                                 <Button startIcon={<PlayCircle />}
                                    onClick={() => handleShowDetails(credential)}> Details
                                </Button>
                            </>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Stack direction="row" gap={1} justifyContent="space-between">
                            <Box display="flex" flexDirection="column">
                                <Typography variant="subtitle1">Name</Typography>
                                <Typography variant="body1" color="primary" gutterBottom>{credential.entityName}</Typography>
                            </Box>
                            <Box display="flex" flexDirection="column">
                                <Typography variant="subtitle1">Issued On</Typography>
                                <Typography variant="body1" color="primary" gutterBottom>{format(parseISO(credential.CreatedAt), DATE_FORMAT)}</Typography>

                            </Box>
                            <Box display="flex" flexDirection="column">
                                <Typography variant="subtitle1">Type</Typography>
                                <Typography variant="body1" color="primary" gutterBottom>{credential.credentialSchema.credentialTypes.map((ct) => ct.name).join(", ")}</Typography>

                            </Box>
                        </Stack>
                    </CardContent>
                </Card>


            ))
            }
            {!identity?.did && (
                <Typography variant="body1">
                    You need a Digital Address to view and request any credentials
                </Typography>
            )

            }
            {(!credentials || credentials.length === 0) && (
                <Typography variant="body1">
                    No credentials found
                </Typography>
            )}

            <Drawer variant="temporary" anchor="right" open={showDetails} onClose={() => setShowDetails(false)}>
                <Box width="50vw" mt={8}>
                    <CredentialDetail credentialMetadata={credentialMetadata} setShowDetails={setShowDetails} handleRevoke={handleRevoke} />
                </Box>
            </Drawer>
        </Box>
    )
}
