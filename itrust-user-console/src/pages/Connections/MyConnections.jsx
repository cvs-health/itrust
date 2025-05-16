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

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Box, Button, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import { AddCircle, Dashboard, List, Reply } from '@mui/icons-material';
import { deleteConnection, findConnections } from '../../services/DigitalAddressService';
import { DISPLAY_LIST } from '../../constants';
import * as Constants from "../../constants"
import ConnectionTable from './ConnectionTable';
import ConnectionCards from './ConnectionCards';

export default function MyConnections() {
    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const navigate = useNavigate();

    const { user } = useAuthContext();
    const [connections, setConnections] = useState([]);
    const { state } = useLocation();
    const { refresh } = { ...state };

    const [displayType, setDisplayType] = useState(Constants.DISPLAY_LIST);

    useEffect(() => {
        const fetchConnections = async () => {
            setLoading(true);
            // console.log('User: ', user)
            const criteria = {
                partyDid: user?.did
            }
            const relations = await findConnections(criteria);
            setConnections(relations);
            // console.log('Connections: ', relations);
            setLoading(false);
        };
        fetchConnections();
    }, [user, refresh]);

    const handleAddConnection = () => {
        navigate("/connections/new");
    }

    const handleDeleteConnection = async(id) => {
        await deleteConnection(id)
        // Remove the deleted tenant from the list
        const newConnections = connections.filter((row) => row.ID !== id);
        setConnections(newConnections);
        setStatus({ open: true, type: "success", message: "Deleted Connection" });
    }

    const handleBack = () => {
        navigate(-1);
    };

    const showList = () => {
        setDisplayType(DISPLAY_LIST);
    }
    const showCardView = () => {
        setDisplayType(Constants.DISPLAY_CARD);
    }


    return loading ? (
        <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="purple" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card elevation={0}>
                <CardHeader
                    title="My Connections"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>View your connections with other parties</Typography>
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
                <CardHeader
                    action={
                        <Stack direction="row" gap={1}>
                            <Button variant="outlined" startIcon={<List />} color="primary" onClick={showList}>
                                List
                            </Button>
                            <Button variant="outlined" startIcon={<Dashboard />} color="primary" onClick={showCardView}>
                                Cards
                            </Button>
                            <Button variant="contained" startIcon={<AddCircle />} onClick={handleAddConnection}>
                                Add Connection
                            </Button>
                        </Stack>
                    }
                />
                <Divider />
                <CardContent>
                    {!connections && (
                        <Typography variant="body1" color="error">You do not have any relations with other entities in the ecosystem</Typography>
                    )
                    }
                    {connections && displayType === Constants.DISPLAY_LIST && (
                        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={1}>
                            <ConnectionTable connections={connections} setConnections={setConnections} deleteConnection={handleDeleteConnection}/>
                        </Box>
                    )}
                    {connections && displayType === Constants.DISPLAY_CARD && (
                        <ConnectionCards connections={connections} deleteConnection={handleDeleteConnection} />

                    )}
                    
                </CardContent>
            </Card>
        </Box>
    )
}
