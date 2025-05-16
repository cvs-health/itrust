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

import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import StatusMessage from './StatusMessage';
import { Code, Reply } from '@mui/icons-material';
import * as Constants from '../constants';

export default function APIDocumentation() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleBack = () => {
        navigate(-1);
    };

    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <Card elevation={0}>
                <CardHeader
                    title="API Documentation"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>Use your Access Keys to programmatically try out APIs</Typography>
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
            </Card>
            <Card>
                <CardContent>
                    <List>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <Code />
                                </Avatar>
                            </ListItemAvatar>
                            <Link to={`${Constants.ITRUST_PROXY}/docs/api/das-service/swagger/index.html`} target="_blank">
                                <ListItemText primary="DAS Service API" secondary="API Endpoints to create Digital Addresses, Manage Credentials" />
                            </Link>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <Code />
                                </Avatar>
                            </ListItemAvatar>
                            <Link to={`${Constants.ITRUST_PROXY}/docs/api/event-service/swagger/index.html`} target="_blank">
                                <ListItemText primary="Event Service API" secondary="API Endpoints to publish events" />
                            </Link>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <Code />
                                </Avatar>
                            </ListItemAvatar>
                            <Link to={`${Constants.ITRUST_PROXY}/docs/api/notification-service/swagger/index.html`} target="_blank">
                                <ListItemText primary="Notification Service API" secondary="API Endpoints to send notiications to users" />
                            </Link>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <Code />
                                </Avatar>
                            </ListItemAvatar>
                            <Link to={`${Constants.ITRUST_PROXY}/docs/api/audit-service/swagger/index.html`} target="_blank">
                                <ListItemText primary="Audit Service API" secondary="API Endpoints to query audit information" />
                            </Link>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <Code />
                                </Avatar>
                            </ListItemAvatar>
                            <Link to={`${Constants.ITRUST_PROXY}/docs/api/mock-service/swagger/index.html`} target="_blank">
                                <ListItemText primary="Mock Service API" secondary="API Endpoints to create simulated data" />
                            </Link>
                        </ListItem>
                    </List>

                </CardContent>
            </Card>

        </Box>
    )
}
