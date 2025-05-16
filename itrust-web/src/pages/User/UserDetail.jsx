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

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CardContent, CardHeader, Divider, Drawer, Stack, Tab, Tabs, Typography } from "@mui/material";
import { GridLoader } from "react-spinners";
import StatusMessage from "../../components/StatusMessage";
import { DataObject, Edit, Reply } from "@mui/icons-material";
import { findExternalIdentityById } from "../../services/MockDataService";
import { useAuthContext } from "../../context/AuthContext";
import TabPanel from "../../components/TabPanel";
import UserGeneralDetail from "./UserGeneralDetail";
import UserCredentialDetail from "./UserCredentialDetail";
import UserDeviceDetail from "./UserDeviceDetail";
import { hasPermission } from "../../services/UserService";
import MockUserData from "./MockUserData";

export default function UserDetail( ) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const navigate = useNavigate();
    const { state } = useLocation();
    const { refresh, showTab  } = { ...state };

    const [identity, setIdentity] = useState();

    // Read the path param
    let { id: externalId } = useParams();
    const { permissions } = useAuthContext();

    const [tab, setTab] = useState(0);

    const [showMock, setShowMock] = useState(false);

    const handleShowMock = () => {
        setShowMock(true);
    }

    useEffect(() => {
        async function getExternalUser(userId) {
            setLoading(true);
            let found = null;
            if (userId) {
                found = await findExternalIdentityById(userId);
                setIdentity(found);
            }
            if (!found) {
                setStatus({ open: true, type: "info", message: "No User found" });
            }
            setLoading(false);
        }
        getExternalUser(externalId);

        // Reset the tab to 0
        showTab ? setTab(showTab) : setTab(0)

    }, [externalId, refresh]);

    const handleBack = () => {
        navigate(-1);
    };


    const handleTabChange = (event, index) => {
        setTab(index);
    };

    const handleEdit = () => {
        navigate(`/identities/edit/${identity?.ID}`, { state: { identity: identity } });
    }

    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card elevation={0}>
                <CardHeader
                    title={`${identity?.firstName} ${identity?.lastName}`}
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>View user details and contact information</Typography>
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

            {identity && <Card>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                        <Tabs value={tab} onChange={handleTabChange} indicatorColor="secondary">
                            <Tab label="General" />
                            <Tab label="Credentials" />
                            <Tab label="Devices" />
                        </Tabs>
                        {hasPermission(permissions, "mock.all") && tab ===0 && <Button startIcon={<Edit color="primary" />} onClick={handleEdit} color="warning" disabled={!identity?.ID}>
                           Edit
                        </Button>}
                        {hasPermission(permissions, "mock.all") && tab === 1 && (<Button startIcon={<DataObject />} variant="contained" onClick={handleShowMock} color="warning" disabled={!identity?.did}>
                            Mock Data
                        </Button>
                        )}
                    </Stack>


                    {tab === 0 && (
                        <TabPanel>
                            <UserGeneralDetail identity={identity} setIdentity={setIdentity} setStatus={setStatus} />
                        </TabPanel>
                    )}
                    {tab === 1 && (
                        <TabPanel>
                            <UserCredentialDetail identity={identity} setStatus={setStatus} />
                        </TabPanel>
                    )}
                    {tab === 2 && (
                        <TabPanel>
                            <UserDeviceDetail setStatus={setStatus} />
                        </TabPanel>
                    )}
                </CardContent>
            </Card>}

            <Drawer variant="temporary" anchor="right" open={showMock} onClose={() => setShowMock(false)}>
                <Box width="60vw" mt={8}>
                    <MockUserData identity={identity} setShowMock={setShowMock} setStatus={setStatus}/>
                </Box>
            </Drawer>

        </Box>
    );
}
