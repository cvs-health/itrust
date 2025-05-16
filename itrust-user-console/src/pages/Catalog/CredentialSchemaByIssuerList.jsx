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

import { Business } from '@mui/icons-material'
import { Box, Button, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'


export default function CredentialSchemaByIssuerList({ issuers }) {

    return (
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
            {issuers && issuers.map((issuer, index) => {
                return (
                    issuer.organization?.digitalAddress && issuer.allowedCredentials?.length>0 && <Card elevation={4} key={issuer.ID} sx={{ width: { xs: '99%', sm: '49%', md: '32%', } }}>
                        <CardHeader
                            title={issuer.organization?.name}
                            titleTypographyProps={{ color: "primary.main", variant: "subtitle2" }}
                            subheader={issuer?.organization?.digitalAddress}
                            avatar={
                                <Business color="primary" />
                            }
                            action={ 
                                <>
                                    <Box display="flex" flexDirection="column">
                                    {(issuer?.organization?.address && (
                                        <>
                                            <Typography variant="subtitle1">{issuer?.organization?.address?.addressLine1}</Typography>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {issuer?.organization?.address?.city} {issuer?.organization?.address?.state.code}{" "}
                                                {issuer?.organization?.address?.zipcode}
                                            </Typography>
                                        </>
                                    )) || (
                                            <Typography variant="body1" gutterBottom>
                                                N.A.
                                            </Typography>
                                        )}
                                    </Box>
                                </>
                            }
                        />
                        <Divider />
                        <CardContent>
                            {
                                issuer.allowedCredentials.map((cred, index) => {
                                    return (
                                        <Stack key={index} direction="row" justifyContent="space-between" alignItems="center" gap={1}>

                                            <Box>
                                                <Typography variant="body1" fontWeight="bold" color="primary">{cred.credentialSchema.name}</Typography>
                                                <Typography variant="body1" gutterBottom>{cred.credentialType.name}</Typography>
                                            </Box>
                                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                                <Button variant="contained">{cred.assuranceLevel}</Button>
                                            </Box>
                                        </Stack>
                                    );
                                })
                            }    
                        </CardContent>
                    </Card>
                );
            })}
        </Box>
    );
}
