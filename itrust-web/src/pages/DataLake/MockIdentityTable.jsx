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

import { DataGrid, GridActionsCellItem, GridRowModes, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { AddCircle, BrandingWatermark, DataObject, Delete, Edit, Mail, MoreVert, OfflineBoltSharp, Refresh, Upload } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";
import { ROWS_PER_PAGE, USER_INVITE } from "../../constants";
import { useAuthContext } from "../../context/AuthContext";
import { hasPermission, sendUserInvite } from "../../services/UserService";
import * as Constants from "../../constants"
import { createDigitalAddress } from "../../services/DigitalAddressService";
import { deleteExternalIdentity, findExternalIdentityById, updateIdentity } from "../../services/MockDataService";
import { set } from "date-fns";

export default function MockIdentityTable({ identities, setShowMock }) {
    const navigate = useNavigate();
    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = useState([]);

    // Warning states
    const [selectedId, setSelectedId] = useState();
    const [openDelete, setOpenDelete] = useState(false);
    const [openMultipleDelete, setOpenMultipleDelete] = useState(false);
    const { permissions } = useAuthContext();

    const [selectedRows, setSelectedRows] = useState([]);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const { user } = useAuthContext();

    useEffect(() => {
        setRows(identities);
    }, [identities]);

    const handleCreateDigitalAddress = async (id) => {

        // Check if the Tenant has been initialized, else show error 
//        console.log ('User: ', user)  
        if(!user?.tenant?.organization?.did) {
            setStatus({ open: true, type: "error", message: "Your tenant has not been initalized. Please create your Tenant's DID and Digital Address" });
            return
        }
            

        // Get the object with id from the list of identities 
        const identity = identities.find((row) => row.ID === id);
        // if identity has a digital address, return a resolved promise
        if(identity.digitalAddress || identity.did) {
            // console.log ('Digital Address already created for ', identity?.firstName + " "+ identity?.lastName)
            setStatus({ open: true, type: "info", message: "Digital Address already created for " + (identity?.firstName + " "+ identity?.lastName) });
            return Promise.resolve();
        }
        const payload = {
            "entityType": Constants.ET_PERSON,
            "firstName": identity?.firstName,
            "lastName": identity?.lastName,
            "dateOfBirth": identity?.dateOfBirth,
            "country": identity?.country,
            "callback": {
                "type": "REST",
                "url": Constants.EXTERNAL_CALLBACK_API+"/api/v1/mock/identities",
                "externalId": identity?.ID,
                "email": identity?.email,
                "phone": identity?.phone,
                "street": identity?.street,
                "city": identity?.city,
                "state": identity?.state,
                "zipcode": identity?.zipcode,
            },
        }
        const response = await createDigitalAddress(payload)
        identity.digitalAddress = response.entityDigitalAddress
        identity.did = response.entityDID
        // const updated = await updateIdentity(identity.ID, identity)

        // Replace the identity in the list of identities
        const updatedIdentities = identities.map((row) => row.ID === id ? identity : row);
        setRows(updatedIdentities);
        setStatus({ open: true, type: "success", message: "Created Digital Address for " + (identity?.firstName + " "+ identity?.lastName) });
    }

    const handleCreateDigitalAddresses = async () => {
        if(!user?.tenant?.organization?.did) {
            setStatus({ open: true, type: "error", message: "Your tenant has not been initalized. Please create your Tenant's DID and Digital Address" });
            return
        }

        
        if(selectedRows) {
            const promises = selectedRows.map(async (id) => {
                return handleCreateDigitalAddress(id)
            });
            // Wait for all promises to resolve
            await Promise.all(promises);
            // Unselect all checkboxes
            setSelectedRows([])
            setStatus({ open: true, type: "success", message: "Created Digital Addresses for " + selectedRows?.length + " identities" });
        }
    
    }

    const columns = [
        {
            field: "firstName",
            headerName: "First Name",
            width: "100",
            editable: true,
            renderCell: (cell) => {
                return <Link to={`/identities/${cell.id}`}>{cell.value}</Link>;
            },
        },
        {
            field: "lastName",
            headerName: "Last Name",
            width: "100",
            editable: true,
            renderCell: (cell) => {
                return <Link to={`/identities/${cell.id}`}>{cell.value}</Link>;
            },
        },
        {
            field: "identityType",
            headerName: "Type",
            width: 100,
            editable: true,
        },
        {
            field: "company",
            headerName: "Company",
            width: 150,
            editable: true,
        },
        {
            field: "digitalAddress",
            headerName: "Digital Address",
            width: "200",
            editable: true,
            renderCell: (cell) => {
                // if(cell.id === 2) {
                //     // console.log(cell);
                // }
                return cell.value ? cell.value : <Button startIcon={<BrandingWatermark />} onClick={() => handleCreateDigitalAddress (cell.id)}>
                    Create
                </Button>;
            },
        },
        {
            field: "did",
            headerName: "DID",
            width: "400",
            editable: true,
            renderCell: (cell) => {
                // if(cell.id === 2) {
                //     console.log(cell);
                // }
                return cell.value ? cell.value : "Not Created"
            },
        },


        /*
        {
            field: "identityProvider",
            headerName: "IDP",
            width: 150,
            editable: true,
        },
        {
            field: "applicationName",
            headerName: "Application Name",
            width: 150,
            editable: true,
        },
        {
            field: "accountId",
            headerName: "Account ID",
            width: 150,
            editable: true,
        },
        */
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 200,
            cellClassName: "actions",

            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                return [
                    <GridActionsCellItem
                        icon={<Edit color="primary" />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditIdentity(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem icon={<Delete color="secondary" />} label="Delete" onClick={() => handleOpenDelete(id)} color="inherit" />,
                ];
            },
        },
    ];

    const handleEditIdentity = (id) => async () => {
        console.log("clicked Edit", id);
        //setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
        // get the credentialSchema with id 
        const externalIdentity = await findExternalIdentityById(id);
        console.log ('Found identity: ', externalIdentity)
        navigate(`/identities/edit/${id}`, { state: { identity: externalIdentity } });
    };

    const handleImportIdentity = () => {
        navigate("/identities/import");
    };

    const handleSelectionModelChange = (selectedIds) => {
        setSelectedRows(selectedIds);
    };


    const handleDeleteIdentity = (id) => async () => {
        await deleteExternalIdentity(id);
        handleCloseDelete();

        // Remove the deleted tenant from the list
        const newIdentities = identities.filter((row) => row.ID !== id);
        setRows(newIdentities);
        setStatus({ open: true, type: "success", message: "Deleted Identity" });
    };

    const handleDeleteMultiple = async() => {
        console.log ('Selected Rows: ', selectedRows)
        if (selectedRows) {

            const promises = selectedRows.map(async (id) => {
                let promise = await deleteExternalIdentity(id);
                return promise
            });
            // Wait for all promises to resolve
            await Promise.all(promises);

            handleCloseMultipleDelete()
            // Remove the deleted tenants from the list 
            const newTenants = identities.filter((row) => !selectedRows.includes(row.ID));
            setRows(newTenants);

            setStatus({ open: true, type: "success", message: "Deleted External Identities" });
        }
    };

    const handleShowMock = () => {
        setShowMock(true)
    };

    const handleSendInvitations = async () => {
        if (selectedRows) {
            const promises = selectedRows.map(async (id) => {
                // Get the identity row 
                const identity = identities.find((row) => row.ID === id);
                const payload = {
                    type: USER_INVITE,
                    tenantId: user?.tenantId,
                    email: identity?.email,
                    data: {
                        id: identity?.ID,
                        firstName: identity?.firstName,
                        lastName: identity?.lastName,
                        identityType: identity?.identityType,
                        accountId: identity?.accountId,
                        externalId: identity?.id,
                        email: identity?.email,
                        phone: identity?.phone,
                        street: identity?.street,
                        city: identity?.city,
                        state: identity?.state,
                        zipcode: identity?.zipcode,
                        country: identity?.country,
                        dateOfBirth: identity?.dateOfBirth,
                        digitalAddress: identity?.digitalAddress,
                        did: identity?.did
                    }
                };
                let promise = await sendUserInvite(payload);
                return promise
            });
            // Wait for all promises to resolve
            await Promise.all(promises);
            // clear the selected rows
            setSelectedRows([])
            setStatus({ open: true, type: "success", message: `Invitation sent to ${selectedRows?.length} users` });
        }
    }

    // Returns a custom tool bar for the identity table
    function IdentityTableToolbar() {
        return (
            <GridToolbarContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <GridToolbarQuickFilter />
                <Box sx={{ marginRight: 8 }}>
                    <Button startIcon={<BrandingWatermark />} onClick={handleCreateDigitalAddresses}>
                        Create Digital Address
                    </Button>
                    <Button startIcon={<Mail />} onClick={handleSendInvitations}>
                        Send Invitation
                    </Button>
                    <Button startIcon={<MoreVert />} />
                    <Button startIcon={<Upload />} onClick={handleImportIdentity}>
                        Import
                    </Button>
                    <GridToolbarExport />
                    <Button
                        startIcon={<Delete color="secondary" />}
                        onClick={handleOpenMultipleDelete}
                        disabled={selectedRows && selectedRows.length > 0 ? false : true}
                    >
                        Delete
                    </Button>
                    <Button
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                    {hasPermission(permissions, "mock.all") && (<Button
                        startIcon={<DataObject color="warning" />}
                        onClick={handleShowMock}
                        
                    >
                        Mock Data
                    </Button>)
                    }

                </Box>
            </GridToolbarContainer>
        );
    }

    function NoRowsOverlay() {
        return (
            <Box display="flex" flexDirection="column" justifyContent={"center"} alignItems={"center"}>
                <Typography sx={{ padding: 2 }}>No identities found</Typography>
            </Box>
        );
    }

    const handleOpenDelete = (id) => {
        setSelectedId(id);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedId(null);
    };
    const handleOpenMultipleDelete = () => {
        setOpenMultipleDelete(true);
    };

    const handleCloseMultipleDelete = () => {
        setOpenMultipleDelete(false);
    };

    const handleRefresh = () => {
        navigate("/identities", { state: { refresh: Math.random() } });
    }

    function getRowId(row) {
        return row.ID;
    }

    return (
        <div style={{ width: "100%" }}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={getRowId}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: ROWS_PER_PAGE,
                        },
                    },
                }}
                pageSizeOptions={[ROWS_PER_PAGE, 50, 100]} // Allow users to change the page size
                checkboxSelection
                disableRowSelectionOnClick
                autoHeight
                slots={{
                    toolbar: IdentityTableToolbar,
                    noRowsOverlay: NoRowsOverlay,
                }}
                sx={{
                    border: 0,
                    boxShadow: 0,
                    fontSize: "1rem",
                    "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                    },
                    "& .MuiDataGrid-columnSeparator": {
                        display: "none",
                    },
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                }}
                // processRowUpdate={handleProcessRowUpdate}
                // onProcessRowUpdateError={handleProcessRowUpdateError}
                // Called on checkbox selection
                // selectionModel={selectedRows}
                onRowSelectionModelChange={handleSelectionModelChange}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Delete identity ?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a identity will remove all associations with other people and organizations. Are you sure?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDelete} color="inherit">
                        No
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDeleteIdentity(selectedId)} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Multiple Confirmation Dialog */}
            <Dialog
                open={openMultipleDelete}
                onClose={handleCloseMultipleDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete identities?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting identities will remove all associations with other people and organizations. Are you sure?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseMultipleDelete} color="inherit">
                        No
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDeleteMultiple} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
