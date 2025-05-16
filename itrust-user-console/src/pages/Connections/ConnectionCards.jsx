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

import { Delete, Lan } from '@mui/icons-material'
import { Box, Button, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { DATE_FORMAT } from '../../constants';

export default function ConnectionCards({ connections, deleteConnection }) {


    return (
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
            {connections.map((connection, index) => (
                <Card elevation={4} key={connection.ID} sx={{ width: { xs: '99%' } }}>
                    <CardHeader
                        title={connection.toParty?.name}
                        titleTypographyProps={{ color: "primary.main", variant: "subtitle2" }}
                        subheader={connection.toParty.digitalAddress}
                        avatar={
                            <Lan color="primary" />
                        }
                        action={
                            <Stack direction="row" gap={4} justifyContent="space-between">
                                <Box display="flex" flexDirection="column">
                                    <Typography variant="subtitle1" >Relation</Typography>
                                    <Typography variant="body1" color="primary">{connection.partyRelationType}</Typography>
                                </Box>
                                <Box display="flex" flexDirection="column">
                                    <Typography variant="subtitle1" >Since</Typography>
                                    <Typography variant="body1" color="primary" >{format(parseISO(connection.UpdatedAt), DATE_FORMAT)}</Typography>
                                </Box>
                                <Button startIcon={<Delete />} onClick={() => deleteConnection(connection?.ID)} color="warning">
                                    Delete
                                </Button>
                            </Stack>

                        }
                    />
                    <Divider />
                    <CardContent>
                        <Stack direction="row" gap={1} justifyContent="space-between">
                            <Box display="flex" flexDirection="column">
                                <Typography variant="subtitle1">From</Typography>
                                <Typography variant="body1" color="primary" gutterBottom>{connection.fromParty?.did}</Typography>

                            </Box>
                            <Box display="flex" flexDirection="column">
                                <Typography variant="subtitle1">To</Typography>
                                <Typography variant="body1" color="primary" gutterBottom>{connection.toParty?.did}</Typography>

                            </Box>
                        </Stack>


                    </CardContent>
                </Card>
            ))
            }
            
        </Box>
    )
}
