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
import { useLocation, useNavigate } from "react-router-dom";
import { deleteTenant, findTenantById } from "../../services/TenantService";
import { Box, Button, Card, CardHeader, Divider, Typography } from "@mui/material";
import { GridLoader } from "react-spinners";
import StatusMessage from "../../components/StatusMessage";
import { Delete, Edit, Reply } from "@mui/icons-material";
import TenantDetail from "./TenantDetail";
import TenantNew from "./TenantNew";
import { useAuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../services/UserService";

export default function MyTenant() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const navigate = useNavigate();
    const { state } = useLocation();
    const { refresh } = { ...state };
    const [tenant, setTenant] = useState();
    const { user, permissions } = useAuthContext();
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        async function getTenant() {
            setLoading(true);
            console.log ('User: ', user);
            console.log ('Permissions: ', permissions);
            // Check if the user has the tenantId 
            let tenant = null;
            if (user?.tenantId) {
                tenant = await findTenantById(user.tenantId);
            }
            if (tenant) {
                setTenant(tenant);
                setEditMode(false);
                setStatus({ open: false, type: "info", message: "Found your Tenant" });
            } else {
                setTenant(null);
                setEditMode(true);
                setStatus({ open: true, type: "info", message: "No Tenant found" });
            }
            setLoading(false);
            //console.log ("Tenant: ", results);
        }

        getTenant();

    }, [user, refresh]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleDelete = async () => {
        console.log("Delete Tenant with id:  ", tenant?.ID);
        const response = await deleteTenant(tenant?.ID);
        console.log("Delete Response: ", response);
        if (response) {
            setStatus({ open: true, type: "success", message: "Tenant Deleted" });
            setTenant(null);
        }
    };

    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card elevation={0}>
                <CardHeader
                    title="My Tenant"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>
                                Digital Address Service enables the identity and business transactions between issuers, service providers and users
                                using a combination of on-Ledger and off-Ledger services to facilitate the capabilities of verifying credentials for
                                relying parties.
                            </Typography>
                        </Box>
                    }
                    action={
                        <>
                            {tenant && (
                                <>
                                    {hasPermission(permissions, "tenant.update") && (
                                        <Button startIcon={<Edit />} onClick={handleEdit} color="primary" disabled={tenant ? false : true}>
                                            Edit
                                        </Button>
                                    )}
                                    {hasPermission(permissions, "tenant.delete") && (
                                        <Button startIcon={<Delete />} onClick={handleDelete} color="secondary" disabled={tenant ? false : true}>
                                            Delete
                                        </Button>
                                    )}
                                </>
                            )}
                            <Button startIcon={<Reply />} onClick={handleBack} color="warning">
                                Back
                            </Button>
                        </>
                    }
                />
                <Divider />
            </Card>
            {editMode && <TenantNew tenant={tenant} setEditMode={setEditMode} />}
            {editMode && !tenant && <TenantNew />}
            {!editMode && tenant && <TenantDetail tenant={tenant} />}
        </Box>
    );
}
