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
import { AddCircle, Delete, Edit, Mail, MoreVert } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";
import { ROWS_PER_PAGE, TENANT_ADMIN_INVITE } from "../../constants";
import { deleteTenant, findTenantById, sendTenantAdminInvite } from "../../services/TenantService";

import { useAuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../services/UserService";

export default function TenantTable({ tenants, setTenants }) {
    const navigate = useNavigate();
    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = useState([]);

    // Warning states
    const [selectedId, setSelectedId] = useState();
    const [openDelete, setOpenDelete] = useState(false);
    const [openMultipleDelete, setOpenMultipleDelete] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const {permissions } = useAuthContext();

    useEffect(() => {
        setRows(tenants);
    }, [tenants]);

    const columns = [
        {
            field: "name",
            headerName: "Name",
            width: "150",
            editable: false,
            renderCell: (cell) => {
                return <Link to={`/tenants/${cell.id}`}>{cell.row.organization.name}</Link>;
            },
        },
        {
            field: "address",
            headerName: "Address",
            width: "200",
            editable: false,
            renderCell: (cell) => {
                return (
                    <Box>
                        <Typography variant="body1">{cell.row.organization?.address?.addressLine1}</Typography>
                        <Typography variant="body1" gutterBottom>
                            {cell.row.organization?.address?.city} {cell.row.organization?.address?.state.code} {cell.row.organization?.address?.zipcode}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: "phone",
            headerName: "Phone",
            width: "150",
            editable: false,
            valueGetter: (cell) => {
                return cell.row.organization?.phone?.main ?? "";
            },
        },
        {
            field: "primaryContact",
            headerName: "Primary Contact",
            width: "150",
            editable: false,
            valueGetter: (cell) => {
                return `${cell.row.primaryContact?.firstName ?? ""} ${cell.row.primaryContact?.lastName ?? ""}`.trim();
            },
        },
        {
            field: "contactEmail",
            headerName: "Contact Email",
            width: "150",
            editable: false,
            valueGetter: (cell) => {
                return cell.row.primaryContact?.email ?? "";
            },
        },
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
                        onClick={handleEditTenant(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem icon={<Delete color="secondary" />} label="Delete" onClick={() => handleOpenDelete(id)} color="inherit" />,
                ];
            },
        },
    ];

    const handleAddTenant = () => {
        navigate("/tenants/new");
    };

    const handleEditTenant = (id) => async () => {
        // console.log("clicked Edit", id);
        //setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
        // get the tenant with id 
        const tenant = await findTenantById(id);
        navigate(`/tenants/edit/${id}`, { state: { tenant: tenant } });
    };

    const handleDeleteTenant = (id) => async () => {
        await deleteTenant(id);
        handleCloseDelete();

        // Remove the deleted tenant from the list
        const newTenants = tenants.filter((row) => row.ID !== id);
        setTenants(newTenants);

        setStatus({ open: true, type: "success", message: "Deleted Tenant" });
    };

    const handleDeleteMultiple = async() => {
        console.log ('Selected Rows: ', selectedRows)
        if (selectedRows) {

            const promises = selectedRows.map(async (id) => {
                let promise = await deleteTenant(id);
                return promise
            });
            // Wait for all promises to resolve
            await Promise.all(promises);

            handleCloseMultipleDelete()
            // Remove the deleted tenants from the list 
            const newTenants = tenants.filter((row) => !selectedRows.includes(row.ID));
            setTenants(newTenants);

            setStatus({ open: true, type: "success", message: "Deleted Tenant(s)" });
        }
    };
    const handleProcessRowUpdate = async (updatedRow, originalRow) => {
        // const s = await saveTenant(person.id, person.tenant.id, updatedRow);
        // setStatus({ open: true, type: "success", message: "Saved Tenant" });
        // return s;
    };
    const handleProcessRowUpdateError = (err) => {
        // console.log(err);
        // setStatus({ open: true, type: "error", message: err });
    };

    const handleSelectionModelChange = (selectedIds) => {
        setSelectedRows(selectedIds);
    };

    const handleSendInvitations = async() => {
        if (selectedRows) {
            const promises = selectedRows.map(async (id) => {
                // Get the tenant row 
                const tenant = tenants.find((row) => row.ID === id);
                const payload = {
                    type: TENANT_ADMIN_INVITE,
                    tenantId: tenant?.ID,
                    contactId : tenant?.primaryContact?.ID,
                    email: tenant?.primaryContact?.email,
                };

                
                let promise = await sendTenantAdminInvite(payload);
                return promise
            });
            // Wait for all promises to resolve
            await Promise.all(promises);
            // clear the selected rows
            setSelectedRows([])
            setStatus({ open: true, type: "success", message: `Invitation sent to ${selectedRows?.length} tenants`});
        }
    }

    // Returns a custom tool bar for the identity table
    function TenantTableToolbar() {
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
                    {
                    hasPermission(permissions, "tenant.create") &&  <Button startIcon={<AddCircle />} onClick={handleAddTenant}>
                        New Tenant
                    </Button>
                    }
                    <Button startIcon={<Mail />} onClick={handleSendInvitations}>
                        Send Invitation
                    </Button>
                    <Button startIcon={<MoreVert />} />

                    <GridToolbarExport />
                    
                    {hasPermission(permissions, "tenant.delete") &&  <Button
                        startIcon={<Delete color="secondary" />}
                        onClick={handleOpenMultipleDelete}
                        disabled={selectedRows && selectedRows.length > 0 ? false : true}
                    >
                        Delete
                    </Button>}
                </Box>
            </GridToolbarContainer>
        );
    }

    function NoRowsOverlay() {
        return (
            <Box display="flex" flexDirection="column" justifyContent={"center"} alignItems={"center"}>
                <Typography sx={{ padding: 2 }}>No tenants found</Typography>
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
                    toolbar: TenantTableToolbar,
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
                processRowUpdate={handleProcessRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                // Called on checkbox selection
                selectionModel={selectedRows}
                onRowSelectionModelChange={handleSelectionModelChange}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Delete tenant?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a tenant will remove all associations with other people and organizations. Are you sure?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDelete} color="inherit">
                        No
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDeleteTenant(selectedId)} autoFocus>
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
                <DialogTitle id="alert-dialog-title">Delete tenants?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting tenants will remove all associations with other people and organizations. Are you sure?
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
