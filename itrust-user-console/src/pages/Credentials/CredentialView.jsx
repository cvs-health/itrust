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
/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { Box, Button, Card, CardContent, CardHeader, CssBaseline, Divider, Drawer, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Footer, Navbar } from '../../components';
import { GridLoader } from 'react-spinners';
import { findCredentialByCredentialId, findCredentialMetadata } from '../../services/DigitalAddressService';
import CredentialDetail from './CredentialDetail';
import { BrandingWatermark, PlayCircle, QrCode2, Report } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { DATE_FORMAT } from '../../constants';
import QRCode from 'react-qr-code'

export default function CredentialView() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    let { id: credentialId } = useParams();
    const [credential, setCredential] = useState();
    const [credentialMetadata, setCredentialMetadata] = useState();
    const [showDetails, setShowDetails] = useState(false);
    const [showQRCode, setShowQRCode] = useState(true);
    const [credentialUrl, setCredentialUrl] = useState(window.location.href);

    useEffect(() => {

        // console.log('Show the credential for connectionId: ', credentialId);
        async function getCredential() {
            try {
                const credential = await findCredentialByCredentialId(credentialId);
                console.log('Credential    : ', credential);

                if (credential) {
                    const vals = JSON.parse(credential.credentialBlob)
                    setCredential(vals);
    
                    const credentialMetadata = await findCredentialMetadata({
                        credentialId: credentialId
                    });
                    if (credentialMetadata && credentialMetadata.length > 0) {
                        // console.log('Credential Metadata: ', credentialMetadata);
                        setCredentialMetadata(credentialMetadata[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching Credential", error);
                setLoading(false);
            }
        }
        getCredential();

    }, [credentialId]);

    const handleShowDetails = (c) => {
        setCredentialMetadata(c);
        setShowDetails(true);
    }

    return loading ? (
        <Box display="flex" flexDirection="column" height="100vh" width="100vw" justifyContent="center" alignItems="center">
            <GridLoader color="#3F51B5" />
        </Box>
    ) :
        (
            <Box display="flex" flexDirection="column" minHeight="100vh" width="100vw" justifyContent="center" alignItems="center">
                <CssBaseline />
                <Navbar />
                <Box display="flex" flexDirection="column" flexGrow={1} width="100%" pb={8} justifyContent="center" alignItems="center">
                    <Typography variant='headline' color="primary" mb={4} gutterBottom>View Your Credential</Typography>

                    {credential && credentialMetadata && <Card elevation={4} key={credential.ID} sx={{ width: { xs: '99%', sm: '49%', md: '32%', } }}>
                        <CardHeader
                            title={credentialMetadata.issuerName}
                            titleTypographyProps={{ color: "primary.main", variant: "subtitle2" }}
                            subheader={credentialMetadata.credentialSchema.name}
                            avatar={
                                <BrandingWatermark color="primary" />
                            }
                            action={
                                <>
                                    {credentialMetadata.revoked && (
                                        <Button startIcon={<Report />} color="warning">
                                            Revoked
                                        </Button>
                                    )}
                                    {showQRCode && <Button startIcon={<QrCode2 />}
                                        onClick={() => setShowQRCode(false)}>Hide QR Code
                                    </Button>
                                    }
                                    {!showQRCode && <Button startIcon={<QrCode2 />}
                                        onClick={() => setShowQRCode(true)} >Show QR Code
                                    </Button>
                                    }
                                    <Button startIcon={<PlayCircle />}
                                        onClick={() => handleShowDetails(credentialMetadata)}>View Details
                                    </Button>

                                </>
                            }
                        />
                        <Divider />
                        
                        <CardContent>
                            <Stack direction="row" gap={1} justifyContent="space-between">
                                <Box display="flex" flexDirection="column">
                                    <Typography variant="subtitle1">Name</Typography>
                                    <Typography variant="body1" color="primary" gutterBottom>{credentialMetadata.entityName}</Typography>
                                </Box>
                                <Box display="flex" flexDirection="column">
                                    <Typography variant="subtitle1">Issued On</Typography>
                                    <Typography variant="body1" color="primary" gutterBottom>{format(parseISO(credentialMetadata.CreatedAt), DATE_FORMAT)}</Typography>

                                </Box>
                                <Box display="flex" flexDirection="column">
                                    <Typography variant="subtitle1">Type</Typography>
                                    <Typography variant="body1" color="primary" gutterBottom>{credentialMetadata.credentialSchema.credentialTypes.map((ct) => ct.name).join(", ")}</Typography>

                                </Box>
                            </Stack>
                        </CardContent>
                        <Divider />
                        {showQRCode && <CardContent>
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                            <QRCode value={btoa(credentialUrl)} size={128} />
                            </Box>
                        </CardContent>}
                        
                    </Card>}

                </Box>
                <Footer />

                <Drawer variant="temporary" anchor="right" open={showDetails} onClose={() => setShowDetails(false)}>
                    <Box width="70vw" mt={8}>
                        <CredentialDetail credentialMetadata={credentialMetadata} setShowDetails={setShowDetails} />
                    </Box>
                </Drawer>
            </Box>
        )
}
