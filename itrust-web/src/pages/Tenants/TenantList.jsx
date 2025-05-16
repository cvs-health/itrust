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

import { Box, Button, Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TenantTable from "./TenantTable";
import { GridLoader } from "react-spinners";
import { Reply } from "@mui/icons-material";
import StatusMessage from "../../components/StatusMessage";
import { findTenants } from "../../services/TenantService";

export default function TenantList() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const [tenants, setTenants] = useState([]);
    const { state } = useLocation();
    const { refresh } = { ...state };

    useEffect(() => {
        async function getTenants() {
            setLoading(true);
            const results = await findTenants();
            setTenants(results);
            setLoading(false);
        }

        getTenants();
    }, [refresh]);

    const handleBack = () => {
        navigate(-1);
    };


    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card>
                <CardHeader
                    title="Tenants"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>
                                Tenants are private and secure namespaces to manage users, policies, and configure settings unique to an organization, ensuring that data and operations remain isolated and under your control.
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
                <CardContent>{tenants && <TenantTable tenants={tenants} setTenants={setTenants}/>}</CardContent>
            </Card>
        </Box>
    );
}
