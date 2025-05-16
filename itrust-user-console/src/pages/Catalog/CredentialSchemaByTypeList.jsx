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

import { BadgeOutlined, Business } from '@mui/icons-material'
import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'



export default function CredentialSchemaByTypeList({ credentialTypeMap }) {

    return (
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
            {credentialTypeMap && [...credentialTypeMap.keys()].map((type) => {
                // console.log ('Schemas: ', credentialTypeMap.get(type))
                return (
                    credentialTypeMap.get(type) && credentialTypeMap.get(type).length > 0 && <Card elevation={4} key={type} sx={{ width: { xs: '99%', sm: '49%', md: '32%', } }}>
                        <CardHeader
                            title={JSON.parse(type)?.name + " Credential Schemas"}
                            titleTypographyProps={{ color: "primary.main", variant: "subtitle2" }}
                            subheader={JSON.parse(type)?.description}
                            avatar={
                                <BadgeOutlined color="primary" />
                            }
                        />
                        <Divider />
                        <CardContent>
                            {credentialTypeMap.get(type).map((schema, index) => {
                                return (
                                    <Stack key={index} direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                                        <Box>
                                            <Typography variant="body1" fontWeight="bold" color="primary">{schema.name}</Typography>
                                            <Typography variant="body1" gutterBottom>{schema.description}</Typography>
                                        </Box>
                                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                                            <Business color="primary" />
                                            <Typography variant="body2" color="primary">Issuers</Typography>
                                        </Box>

                                    </Stack>
                                );
                            })}
                        </CardContent>
                    </Card>
                );
            })}
        </Box>
    );
}
