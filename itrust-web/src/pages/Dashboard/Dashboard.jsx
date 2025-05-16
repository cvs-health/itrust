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

import { BrandingWatermark, Business, Fingerprint, Reply } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import { GridLoader } from "react-spinners";
import { hasPermission } from "../../services/UserService";
import { useAuthContext } from "../../context/AuthContext";
import { PERMISSIONS } from "../../constants";
import { countTenants } from "../../services/TenantService";
import { countCredentials, countDigitalAddresses } from "../../services/DigitalAddressService";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: 1,
        marginBottom: 1,
    },
}));

export default function Dashboard({ refresh }) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        tenants: 0,
        digitalAddresses: 0,
        credentialsIssued: 0,

    });
    const { user, permissions, isInitialized } = useAuthContext();

    useEffect(() => {
        async function getStats() {
            setLoading(true);
            getTenantCount()
            getDigitalAddressCount()
            getCredentialsCount()
            setLoading(false);
        }

        getStats();
    }, [refresh, isInitialized]);

    const getTenantCount = async () => {
        const response = await countTenants();
        if (response?.status === 'Success') {
            setStats((prevStats) => ({
                ...prevStats,
                tenants: response?.data?.count,
            }));
        }
    }

    const getDigitalAddressCount = async () => {
        // Check for the DID of the organization
        var did = ""
        if (user?.tenantId) {
            did = user?.tenant?.organization?.did
        } else if (user?.dasId) {
            did = user?.das.organization?.did
        }
        const response = await countDigitalAddresses(did);
        if (response?.status === 'Success') {
            setStats((prevStats) => ({
                ...prevStats,
                digitalAddresses: response?.data?.count,
            }));
        }
    }

    const getCredentialsCount = async () => {
        // Check for the DID of the organization
        var did = ""
        if (user?.tenantId) {
            did = user?.tenant?.organization?.did
        } else if (user?.dasId) {
            did = user?.das.organization?.did
        }
        const response = await countCredentials(did);
        if (response?.status === 'Success') {
            setStats((prevStats) => ({
                ...prevStats,
                credentialsIssued: response?.data?.count,
            }));
        }
    }



    const handleBack = () => {
        navigate(-1);
    };

    return loading ? (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="70vw" height="70vh">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1} >
            <Card>
                <CardHeader
                    title="Dashboard"
                    titleTypographyProps={{ color: "primary.main", variant: "headline" }}
                    subheader="Your Central Hub for Real-Time Insights and Actionable Data"
                    action={
                        <Button
                            startIcon={<Reply />}
                            //onClick={handleBack}
                            color="warning"
                        >
                            Back
                        </Button>
                    }
                />
                <Divider />
                <CardContent sx={{ position: "relative" }}>
                    <Grid container spacing={1}>
                        {hasPermission(permissions, PERMISSIONS.TENANT_ALL) &&
                            <Grid item xs={12} sm={6} md={3}>
                                <Link to="/tenants">
                                    <StatCard
                                        type="fill"
                                        title="Tenants"
                                        value={stats?.tenants}
                                        icon={<Business color="white" />}
                                        color="primary.main"
                                    />
                                </Link>
                            </Grid>}
                        <Grid item xs={12} sm={6} md={3}>
                            <Link to="/reports/digital-address">
                                <StatCard
                                    type="fill"
                                    title="Digital Address Issued"
                                    value={stats?.digitalAddresses}
                                    icon={<Fingerprint color="white" />}
                                    color="primary.main"
                                />
                            </Link>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Link to="/reports/credentials">
                                <StatCard
                                    type="fill"
                                    title="Credentials Issued"
                                    value={stats?.credentialsIssued}
                                    icon={<BrandingWatermark color="white" />}
                                    color="primary.main"
                                />
                            </Link>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}
