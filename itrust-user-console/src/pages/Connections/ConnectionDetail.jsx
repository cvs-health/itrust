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
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteConnection, findConnectionById } from '../../services/DigitalAddressService';
import { Box, Button, Card, CardContent, CardHeader, Divider, Tab, Tabs, Typography } from '@mui/material';
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import { Delete, Reply } from '@mui/icons-material';
import TabPanel from "../../components/TabPanel";
import { format, parseISO } from 'date-fns';
import { DATE_FORMAT } from '../../constants';
import ConnectionHistoryTable from './ConnectionHistoryTable';

export default function ConnectionDetail(props) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const navigate = useNavigate();
    const { state } = useLocation();
    const { refresh, showTab } = { ...state };
    const [connection, setConnection] = useState()
    let { id: connectionId } = useParams();
    const [tab, setTab] = useState(0);
    const [openDelete, setOpenDelete] = useState(false);

    useEffect(() => {
        async function getConnection(connectionId) {
            setLoading(true);
            let found = null;
            if (connectionId) {
                found = await findConnectionById(connectionId);
            } else if (props.connection) {
                found = props.connection
            }
            console.log('Connection: ', found);
            setConnection(found);
            if (!found) {
                setStatus({ open: true, type: "info", message: "No Connection found" });
            }
            setLoading(false);
        }
        getConnection(connectionId);
        showTab ? setTab(showTab) : setTab(0)
    }, [connectionId, refresh, showTab]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleDelete = async () => {
        console.log("Delete Relation with id:  ", connection?.ID);
        const response = await deleteConnection(connection?.ID);
        handleCloseDelete();
        if (response) {
            setStatus({ open: true, type: "success", message: "Connection Deleted" });
            setConnection(null)
        }
        navigate("/connections");
    };

    const handleTabChange = (event, index) => {
        setTab(index);
    };

    return loading ? (
        <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="purple" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card elevation={0}>
                <CardHeader
                    title="Connection Details"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>View connection details</Typography>
                        </Box>
                    }
                    action={
                        <>
                            {connection && (
                                <Button startIcon={<Delete />} onClick={handleOpenDelete} color="secondary" disabled={connection ? false : true}>
                                    Delete
                                </Button>
                            )}
                            <Button startIcon={<Reply />} onClick={handleBack} color="warning">
                                Back
                            </Button>
                        </>
                    }
                />
                <Divider />
            </Card>

            <Card>
                {connection && <CardContent>
                    <Tabs value={tab} onChange={handleTabChange} aria-label="Tenant Details" indicatorColor="secondary">
                        <Tab label="General" />
                        <Tab label="History" />
                    </Tabs>

                    {tab === 0 && (
                        <TabPanel>
                            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }} >
                                <Typography variant="headline" color="primary" >
                                    Relation Details
                                </Typography>
                                <Typography variant="body1" fontWeight={"bold"}>
                                    Relation
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {connection?.partyRelationType}
                                </Typography>
                                <Typography variant="body1" fontWeight={"bold"}>
                                    Since
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {format(parseISO(connection?.UpdatedAt), DATE_FORMAT)}
                                </Typography>
                            </Box>
                            <Box mt={2}>
                                <Typography variant="headline" color="primary" >
                                    Party Details
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "row" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        From
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {connection?.fromParty?.name}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Digital Address
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {connection?.fromParty?.digitalAddress}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        DID
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {connection?.fromParty?.did}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        To
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {connection?.toParty?.name}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Digital Address
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {connection?.toParty?.digitalAddress}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        DID
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {connection?.toParty?.did}
                                    </Typography>
                                </Box>
                            </Box>
                        </TabPanel>
                    )}
                    {tab === 1 && (
                        <TabPanel>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <ConnectionHistoryTable />
                            </Box>
                        </TabPanel>
                    )}
                </CardContent>}
            </Card>

        </Box>
    )
}
