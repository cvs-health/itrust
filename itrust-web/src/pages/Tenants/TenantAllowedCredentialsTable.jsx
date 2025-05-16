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

import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Delete, Mail, MoreVert } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";
import { ROWS_PER_PAGE } from "../../constants";
import { deleteAllowedCredential, saveAllowedCredential } from "../../services/TenantService";

import SchemaSelectionTable from "./SchemaSelectionTable";


export default function TenantAllowedCredentialsTable({ tenantId, allowedCredentials, setAllowedCredentials }) {
    const navigate = useNavigate();
    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    // Warning states
    const [selectedId, setSelectedId] = useState();
    const [openDelete, setOpenDelete] = useState(false);
    const [openMultipleDelete, setOpenMultipleDelete] = useState(false);
    const [showSchemaSelection, setShowSchemaSelection] = useState(false);



    useEffect(() => {
        setRows(allowedCredentials);
    }, [allowedCredentials]);


    const columns = [
        {
            field: "credentialSchemaName",
            headerName: "Credential Schema",
            width: "200",
            editable: false,
            valueGetter: (cell) => {
                return `${cell.row.credentialSchema?.name ?? ""} (${cell.row.credentialSchema?.version ?? ""})`.trim() || "";
            },
        },

        {
            field: "credentialSchemaDescription",
            headerName: "Description",
            width: "300",
            editable: false,
            valueGetter: (cell) => {
                return cell.row.credentialSchema?.description ?? "";
            },

        },
        {
            field: "type",
            headerName: "Credential Type",
            width: "150",
            editable: false,
            valueGetter: (cell) => {
                return cell.row.credentialType?.name ?? "";
            },

        },
        {
            field: "assuranceLevel",
            headerName: "Assurance Level",
            width: "150",
            editable: true,

        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 200,
            cellClassName: "actions",

            getActions: ({ id }) => {

                return [
                    <GridActionsCellItem icon={<Delete color="secondary" />} label="Delete" onClick={() => handleOpenDelete(id)} color="inherit" />,
                ];
            },
        },

    ];

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

    const handleDeleteAllowedCredential = (id) => async () => {
        // get the object from the list of allowed credentials 
        const credential = allowedCredentials.find((row) => row.ID === id);
        console.log ('Credential: ', credential)
        await deleteAllowedCredential(credential.tenantId, id);
        handleCloseDelete();

        // Remove the deleted tenant from the list
        const newCredentials = allowedCredentials.filter((row) => row.ID !== id);
        setAllowedCredentials(newCredentials);

        setStatus({ open: true, type: "success", message: "Deleted Credential Access" });
    };

    const handleDeleteMultiple = async () => {
        // console.log('Selected Rows: ', selectedRows)
        if (selectedRows) {
            const promises = selectedRows.map(async (id) => {
                let promise = await deleteAllowedCredential(tenantId, id);
                return promise
            });
            // Wait for all promises to resolve
            await Promise.all(promises);

            handleCloseMultipleDelete()
            // Remove the deleted tenants from the list 
            const newCredentials = allowedCredentials.filter((row) => !selectedRows.includes(row.ID));
            setAllowedCredentials(newCredentials);

            setStatus({ open: true, type: "success", message: "Deleted Credential(s) Access" });
        }
    };

    function handleAddAllowedCredentials() {
        setShowSchemaSelection(true);
    }

    
    // Returns a custom tool bar for the identity table
    function AllowedCredentialTableToolbar() {
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
                    <Button startIcon={<Mail />} onClick={handleAddAllowedCredentials}>
                        Add Allowed Credential
                    </Button>
                    <Button startIcon={<MoreVert />} />
                    <Button
                        startIcon={<Delete color="secondary" />}
                        onClick={handleOpenMultipleDelete}
                        disabled={selectedRows && selectedRows.length > 0 ? false : true}
                    >
                        Delete
                    </Button>
                </Box>
            </GridToolbarContainer>
        );
    }

    function NoRowsOverlay() {
        return (
            <Box display="flex" flexDirection="column" justifyContent={"center"} alignItems={"center"}>
                <Typography sx={{ padding: 2 }}>Tenant has not been configured issue any credentials</Typography>
            </Box>
        );
    }

    const handleProcessRowUpdate = async (updatedRow, originalRow) => {
        // console.log ('Updated Row: ', updatedRow)
        const s = await saveAllowedCredential(tenantId, updatedRow);
        setStatus({ open: true, type: "success", message: "Saved Allowed Schema" });
        return s;
    };
    const handleProcessRowUpdateError = (err) => {
        // console.log(err);
        setStatus({ open: true, type: "error", message: err });
    };

    const handleSelectionModelChange = (selectedIds) => {
        setSelectedRows(selectedIds);
    };

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
                    toolbar: AllowedCredentialTableToolbar,
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
                <DialogTitle id="alert-dialog-title">Delete credential schema?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a credential schema will remove ability for your tenant to issue credentials to their users. Are you sure?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDelete} color="inherit">
                        No
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDeleteAllowedCredential(selectedId)} autoFocus>
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
                <DialogTitle id="alert-dialog-title">Delete credential(s) schema?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    Deleting a credential schema(s) will remove ability for your tenant to issue credentials to their users. Are you sure?
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

            <Drawer variant="temporary" anchor="right" open={showSchemaSelection} onClose={() => setShowSchemaSelection(false)}>
                <Box width="50vw" mt={8}>
                    <SchemaSelectionTable tenantId={tenantId} allowedCredentials={allowedCredentials} setAllowedCredentials={setAllowedCredentials}/>
                </Box>
            </Drawer>
        </div>
    );
}
