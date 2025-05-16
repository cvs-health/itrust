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
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteTenant, findTenantById, sendTenantAdminInvite } from "../../services/TenantService";
import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Slider, Stack, Tab, Tabs, Typography, Alert } from "@mui/material";
import { GridLoader } from "react-spinners";
import StatusMessage from "../../components/StatusMessage";
import { Delete, Edit, Mail, Reply } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { DATE_FORMAT, TENANT_ADMIN_INVITE } from "../../constants";
import TabPanel from "../../components/TabPanel";
import * as Constants from "../../constants"
import DigitalAddressPanel from "../../components/DigitalAddressPanel";
import { createDigitalAddress } from "../../services/DigitalAddressService";
import { useAuthContext } from "../../context/AuthContext";
import TenantCredentialDetail from "./TenantCredentialDetail";
import TenantPermissions from "./TenantPermissions";
import { hasPermission } from "../../services/UserService";

export default function TenantDetail(props) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const navigate = useNavigate();
    const { state } = useLocation();
    const { refresh, showTab } = { ...state };

    const [tenant, setTenant] = useState();
    const [das, setDas] = useState();

    // Read the path param
    let { id: tenantId } = useParams();
    const [tab, setTab] = useState(0);

    const [showDAPanel, setShowDAPanel] = useState(false);
    const [creatingDA, setCreatingDA] = useState(false);

    // confirmation dialogs
    const [openDelete, setOpenDelete] = useState(false);
    const { user, permissions, isInitialized } = useAuthContext();
    const [disableDA, setDisableDA] = useState(true);


    useEffect(() => {

        async function getTenant(tenantId) {
            setLoading(true);
            // Check if tenant id is provide
            let found = null;
            if (tenantId) {
                found = await findTenantById(tenantId);
            } else if (props.tenant) {
                found = props.tenant
            }

            if (found?.organization?.digitalAddress) {
                setShowDAPanel(true);
            }
            setTenant(found);
            setDas(found?.das)

            if (!found) {
                setStatus({ open: true, type: "info", message: "No Tenant found" });
            }

            // If DAS is initialized but tenant is not initialzied, then disable DA creation
        // console.log ('DAS: ', das, " Tenant: ", tenant, " User: ", user)
        if (!found?.das?.organization?.did) {
            setDisableDA(true);
        }else if (user?.tenantId && !found?.organization?.did ) {
            setDisableDA(false); 
        }else {
            setDisableDA(false);
        }

            setLoading(false);
        }


        getTenant(tenantId);
        showTab ? setTab(showTab) : setTab(0)
        

    }, [user, tenantId, refresh, isInitialized]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = async () => {
        console.log("Edit Tenant with id:  ", tenant?.ID);
        //setEditMode(true);
        const t = await findTenantById(tenant?.ID);
        navigate(`/tenants/edit/${tenant?.ID}`, { state: { tenant: t } });
    };
    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleDelete = async () => {
        console.log("Delete Tenant with id:  ", tenant?.ID);
        const response = await deleteTenant(tenant?.ID);
        handleCloseDelete();
        console.log("Delete Response: ", response);
        if (response) {
            setStatus({ open: true, type: "success", message: "Tenant Deleted" });
            setTenant(null);
        }
        navigate("/tenants");
    };

    const handleTabChange = (event, index) => {
        setTab(index);
    };

    const handleSendInvitation = async () => {
        const payload = {
            type: TENANT_ADMIN_INVITE,
            tenantId: tenant?.ID,
            contactId: tenant?.primaryContact?.ID,
            email: tenant?.primaryContact?.email,
            phone: tenant?.primaryContact?.phone,
        };

        //console.log ("Payload: ", payload);
        await sendTenantAdminInvite(payload);
        setStatus({ open: true, type: "success", message: "Invitation sent" });
    }

    const handleCreateDigitalAddress = async () => {
        setCreatingDA(true);
        const payload = {
            "entityType": Constants.ET_ORGANIZATION,
            "businessName": tenant?.organization?.name,
            "countryOfIncorporation": tenant?.organization?.countryOfIncorporation,
            "dateOfIncorporation": das?.organization?.dateOfIncorporation,
            "stateOfIncorporation": das?.organization?.stateOfIncorporation,
            "identifier": tenant?.identifier,
            "callback": {
                "type": "REST",
                "url": Constants.EXTERNAL_CALLBACK_API + "/api/v1/mock/identities",
                "tenantId": tenant?.ID,
            },
        }
        const response = await createDigitalAddress(payload)

        tenant.organization.digitalAddress = response.entityDigitalAddress
        tenant.organization.did = response.entityDID
        // Save the DAS 
        //const updated = await updateTenant(tenant.ID, tenant)
        setTenant(tenant);

        setShowDAPanel(true);
        setTimeout(() => {
            setCreatingDA(false);
        }, 1 * 1000);
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
                    title={`${tenant?.organization?.name} Details`}
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>View tenant details and contact information</Typography>
                        </Box>
                    }
                    action={
                        <>
                            {tenant && (
                                <>
                                    {hasPermission(permissions, "tenant.create") && <Button startIcon={<Mail />} onClick={handleSendInvitation} color="primary" disabled={tenant ? false : true}>
                                        Send Invitation
                                    </Button>}
                                    {/* <Button startIcon={<MoreVert />} /> */}
                                    {hasPermission(permissions, "tenant.update") && <Button startIcon={<Edit />} onClick={handleEdit} color="primary" disabled={tenant ? false : true}>
                                        Edit
                                    </Button>}
                                    {hasPermission(permissions, "tenant.delete") && <Button startIcon={<Delete />} onClick={handleOpenDelete} color="secondary" disabled={tenant ? false : true}>
                                        Delete
                                    </Button>}
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

            <Card>
                <CardContent>
                    <Tabs value={tab} onChange={handleTabChange} aria-label="Tenant Details" indicatorColor="secondary">
                        <Tab label="General" />
                        <Tab label="Contact" />
                        <Tab label="Risk Assessment" />
                        <Tab label="Subscription" />
                        <Tab label="Credentials" />
                        {hasPermission(permissions, "tenant.allow-credentials") && <Tab label="Permissions" />}
                    </Tabs>

                    {tab === 0 && (
                        <TabPanel>
                            <Box sx={{ display: "flex", flexDirection: "row" }}>
                                <Box sx={{ display: "flex", flexDirection: "column" }} width="25%">
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Name
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {tenant?.organization?.name || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Identifier
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {tenant?.identifier || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        DBA
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {tenant?.organization?.dba || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        TaxId
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {tenant?.organization?.taxId || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Date of Incorporation
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {(tenant?.organization?.dateOfIncorporation &&
                                            format(parseISO(tenant?.organization?.dateOfIncorporation), DATE_FORMAT)) ||
                                            "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        State of Incorporation
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {tenant?.organization?.stateOfIncorporation || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Country of Incorporation
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {tenant?.organization?.countryOfIncorporation || "N.A."}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", flexDirection: "column" }} width="25%">
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Address
                                    </Typography>
                                    {(tenant?.organization?.address && (
                                        <>
                                            <Typography variant="body1">{tenant?.organization?.address?.addressLine1}</Typography>
                                            <Typography variant="body1" gutterBottom>
                                                {tenant?.organization?.address?.city} {tenant?.organization?.address?.state.code}{" "}
                                                {tenant?.organization?.address?.zipcode}
                                            </Typography>
                                        </>
                                    )) || (
                                            <Typography variant="body1" gutterBottom>
                                                N.A.
                                            </Typography>
                                        )}

                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Phone
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {tenant?.organization?.phone?.main || "N.A."} {tenant?.organization?.phone?.extension || ""}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Website
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {tenant?.organization?.website || "N.A."}
                                    </Typography>
                                </Box>
                                <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center" width="50%" gap={2}>
                                    {showDAPanel && (
                                        <DigitalAddressPanel identity={tenant?.organization} loading={creatingDA} />
                                    )}
                                    {!showDAPanel && (
                                        <>
                                            <Typography variant="headline">
                                                Create a Digital Address for {tenant?.organization?.name}
                                            </Typography>
                                            <Stack direction="row" spacing={2}>
                                                <Button variant="contained" sx={{ width: '16em', height: '8em', fontSize: '1em' }} onClick={handleCreateDigitalAddress} disabled={disableDA}>Create Digital Address</Button>
                                                <Button variant="contained" sx={{ width: '16em', height: '8em', fontSize: '1em' }} onClick={handleSendInvitation} disabled={!disableDA}> Invite to Register</Button>
                                            </Stack>
                                            {disableDA && (
                                                <Alert severity="error" sx={{ mb: 4 }}>
                                                    Your DAS has not been initialized yet. Please wait till you are notified of your service availability.
                                                </Alert>
                                            )}
                                            {!disableDA && (
                                                <Alert severity="error" sx={{ mb: 4 }}>
                                                    You must initialize your Tenant before sending an invitation. To create Digital Address for your organization, please go to <Link to="/tenant/my_tenant">My Tenant</Link> under your profile.
                                                </Alert>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </TabPanel>
                    )}
                    {tab === 1 && (
                        <TabPanel>
                            <Box sx={{ display: "flex", flexDirection: "column" }} width="30%">
                                <Typography variant="body1" fontWeight={"bold"}>
                                    Contact Name
                                </Typography>
                                {(tenant?.primaryContact && (
                                    <Typography variant="body1" gutterBottom>
                                        {tenant?.primaryContact?.firstName} {tenant?.primaryContact?.lastName}
                                    </Typography>
                                )) || (
                                        <Typography variant="body1" gutterBottom>
                                            N.A.
                                        </Typography>
                                    )}
                                <Typography variant="body1" fontWeight={"bold"}>
                                    Address
                                </Typography>
                                {(tenant?.primaryContact?.address && (
                                    <>
                                        <Typography variant="body1">{tenant?.primaryContact?.address?.addressLine1}</Typography>
                                        <Typography variant="body1" gutterBottom>
                                            {tenant?.primaryContact?.address?.city} {tenant?.primaryContact?.address?.state.code}
                                            {tenant?.primaryContact?.address?.zipCode}
                                        </Typography>
                                    </>
                                )) || (
                                        <Typography variant="body1" gutterBottom>
                                            N.A.
                                        </Typography>
                                    )}

                                <Typography variant="body1" fontWeight={"bold"}>
                                    Phone
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {tenant?.primaryContact?.phone?.work || "N.A."}
                                </Typography>
                                <Typography variant="body1" fontWeight={"bold"}>
                                    Email
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {tenant?.primaryContact?.email || "N.A."}
                                </Typography>
                            </Box>
                        </TabPanel>
                    )}
                    {tab === 2 && (
                        <TabPanel>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} width="50%">
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <Typography variant="body1" width="40%">
                                        Business Risk Score
                                    </Typography>
                                    <Slider
                                        name="businessRiskScore"
                                        value={tenant?.businessRiskScore ?? 0}
                                        aria-label="Default"
                                        valueLabelDisplay="auto"
                                        step={10}
                                        marks
                                        min={10}
                                        max={100}
                                    />
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <Typography variant="body1" width="40%">
                                        Security Risk Score
                                    </Typography>
                                    <Slider
                                        name="securityRiskScore"
                                        value={tenant?.securityRiskScore ?? 0}
                                        aria-label="Default"
                                        valueLabelDisplay="auto"
                                        step={10}
                                        marks
                                        min={10}
                                        max={100}
                                    />
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <Typography variant="body1" width="40%">
                                        Overall Risk Score
                                    </Typography>
                                    <Slider
                                        name="overallRiskScore"
                                        value={tenant?.overallRiskScore ?? 0}
                                        aria-label="Default"
                                        valueLabelDisplay="auto"
                                        step={10}
                                        marks
                                        min={10}
                                        max={100}
                                    />
                                </Stack>
                            </Box>
                        </TabPanel>
                    )}
                    {tab === 3 && (
                        <TabPanel>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} width="40%">
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <Typography variant="body1" width="40%">
                                        Subscription Tier
                                    </Typography>
                                    <Typography variant="body1">{tenant?.tier?.name || "N.A."}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <Typography variant="body1" width="40%">
                                        Subscription Start
                                    </Typography>
                                    <Typography variant="body1">
                                        {tenant?.subscriptionStart ? format(parseISO(tenant?.subscriptionStart), DATE_FORMAT) : "NA"}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <Typography variant="body1" width="40%">
                                        Subscription End
                                    </Typography>
                                    <Typography variant="body1">
                                        {tenant?.subscriptionEnd ? format(parseISO(tenant?.subscriptionEnd), DATE_FORMAT) : "NA"}
                                    </Typography>
                                </Stack>
                            </Box>
                        </TabPanel>
                    )}
                    { tab === 4 && (
                        <TenantCredentialDetail tenant={tenant} setStatus={setStatus}/>
                    )}
                    { tab === 5 && (
                        <TenantPermissions tenantId={tenantId} />
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Delete Tenant?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a tenant will remove all associations with other people and organizations. Are you sure?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDelete} color="inherit">
                        No
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDelete} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
