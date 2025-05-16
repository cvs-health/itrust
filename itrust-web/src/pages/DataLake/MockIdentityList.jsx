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

import { Box, Breadcrumbs, Button, Card, CardContent, CardHeader, Divider, Drawer, Paper, Stack, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { findExternalIdentities } from "../../services/MockDataService";
import MockIdentityTable from "./MockIdentityTable";
import { GridLoader } from "react-spinners";
import { AddCircle, Reply } from "@mui/icons-material";
import StatusMessage from "../../components/StatusMessage";
import { useAuthContext } from "../../context/AuthContext";
import { findTenantById } from "../../services/TenantService";
import IdentitySearchForm from "./IdentitySearchForm";
import MockPersonForm from "./MockPersonForm";

export default function MockIdentityList() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const [identities, setIdentities] = useState([]);
    const [formData, setFormData] = useState({
        company: "",
        identityProvider: "",
        identityType: "",
        applicationName: "",
    });
    const { user } = useAuthContext();
    const [tenant, setTenant] = useState({});
    const [showMock, setShowMock] = useState(false);
    const { state } = useLocation();
    const { refresh } = { ...state };


    useEffect(() => {
        async function getMockIdentities() {
            setLoading(true);
            // Check the tenant of the user and get the list of users 
            let t = null
            // console.log('User: ', user)
            if (user?.tenantId) {
                t = await findTenantById(user.tenantId);
                setTenant(t);
            }

            // Update the form Data with the tenant identifier
            setFormData({ ...formData, company: t?.identifier });

            //Get the parameters from the URL
            const criteria = {
                company: t?.identifier || params.get("company"),
                identityProvider: params.get("identityProvider"),
                identityType: params.get("identityType"),
            };
            // console.log ('Criteria: ', criteria)

            await handleSubmit(criteria);
            setLoading(false);
        }


        getMockIdentities();
    }, [user, refresh]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (criteria) => {
        setLoading(true);
        const results = await findExternalIdentities(criteria);
        setIdentities(results);
        setLoading(false);
    }

    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card>
                <CardHeader
                    title={`${formData.company || 'All'} Identities`}
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>
                                These are identities aggregated from external systems of record into a Data Lake or Warehouse by various integrations.
                                A typical use case is users having multiple accounts in different systems. Use this view to initiate the process of
                                initiating the Digital Address Creation or Linking to existing identities.
                            </Typography>
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
                <CardContent>
                    <Typography variant="headline">Criteria</Typography>
                    <IdentitySearchForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />

                </CardContent>
                <Divider />
                <CardContent>{identities && <MockIdentityTable identities={identities} setShowMock={setShowMock}/>}</CardContent>
            </Card>

            <Drawer variant="temporary" anchor="right" open={showMock} onClose={() => setShowMock(false)}>
                <Box width="30vw" mt={8}>
                    <MockPersonForm setShowMock={setShowMock} setStatus={setStatus}/>
                </Box>
            </Drawer>

        </Box>
    );
}
