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
import { deleteCredentialSchema, findCredentialSchemaById } from "../../services/CredentialSchemaService";

import { useAuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../services/UserService";

export default function CredentialSchemaTable({ credentialSchemas, setCredentialSchemas }) {
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
    const { permissions } = useAuthContext();

    useEffect(() => {
        setRows(credentialSchemas);
    }, [credentialSchemas]);

    const columns = [
        {
            field: "name",
            headerName: "Name",
            width: "200",
            editable: false,
            renderCell: (cell) => {
                return <Link to={`/credential_schema/${cell.id}`}>{cell.row.name}</Link>;
            },
        },

        {
            field: "version",
            headerName: "Version",
            width: "100",
            editable: false,
        },

        {
            field: "credentialTypes",
            headerName: "Credential Type(s)",
            width: "200",
            editable: false,
            renderCell: (cell) => {
                return cell.row.credentialTypes?.map((ct) => ct.name).join(", ");
            }
        },
        {
            field: "code",
            headerName: "Code",
            width: "200",
            editable: false,
        },
        {
            field: "status",
            headerName: "Status",
            width: "100",
            editable: false,
        },
        // {
        //     field: "description",
        //     headerName: "Description",
        //     width: "300",
        //     editable: false,
        // },
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
                        onClick={handleEditCredentialSchema(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem icon={<Delete color="secondary" />} label="Delete" onClick={() => handleOpenDelete(id)} color="inherit" />,
                ];
            },
        },
    ];

    const handleAddCredentialSchema = () => {
        navigate("/credential_schema/new");
    };

    const handleEditCredentialSchema = (id) => async () => {
        console.log("clicked Edit", id);
        //setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
        // get the credentialSchema with id 
        const credentialSchema = await findCredentialSchemaById(id);
        console.log('Sending Credential Schema: ', credentialSchema)
        navigate(`/credential_schema/edit/${id}`, { state: { credentialSchema: credentialSchema } });
    };

    const handleDeleteCredentialSchema = (id) => async () => {
        await deleteCredentialSchema(id);
        handleCloseDelete();

        // Remove the deleted credentialSchema from the list
        const newCredentialSchemas = credentialSchemas.filter((row) => row.ID !== id);
        setCredentialSchemas(newCredentialSchemas);

        setStatus({ open: true, type: "success", message: "Deleted CredentialSchema" });
    };

    const handleDeleteMultiple = async () => {
        console.log('Selected Rows: ', selectedRows)
        if (selectedRows) {

            const promises = selectedRows.map(async (id) => {
                let promise = await deleteCredentialSchema(id);
                return promise
            });
            // Wait for all promises to resolve
            await Promise.all(promises);

            handleCloseMultipleDelete()
            // Remove the deleted credentialSchemas from the list 
            const newCredentialSchemas = credentialSchemas.filter((row) => !selectedRows.includes(row.ID));
            setCredentialSchemas(newCredentialSchemas);

            setStatus({ open: true, type: "success", message: "Deleted CredentialSchema(s)" });
        }
    };
    const handleProcessRowUpdate = async (updatedRow, originalRow) => {
        // const s = await saveCredentialSchema(person.id, person.credentialSchema.id, updatedRow);
        // setStatus({ open: true, type: "success", message: "Saved CredentialSchema" });
        // return s;
    };
    const handleProcessRowUpdateError = (err) => {
        // console.log(err);
        // setStatus({ open: true, type: "error", message: err });
    };

    const handleSelectionModelChange = (selectedIds) => {
        setSelectedRows(selectedIds);
    };


    // Returns a custom tool bar for the identity table
    function CredentialSchemaTableToolbar() {
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
                        hasPermission(permissions, "vc.manage") && <Button startIcon={<AddCircle />} onClick={handleAddCredentialSchema}>
                            New Credential Schema
                        </Button>
                    }
                    <Button startIcon={<MoreVert />} />

                    <GridToolbarExport />

                    {hasPermission(permissions, "vc.manage") && <Button
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
                <Typography sx={{ padding: 2 }}>No credential schemas found</Typography>
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
                    toolbar: CredentialSchemaTableToolbar,
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
                <DialogTitle id="alert-dialog-title">Delete Credential Schema?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a credential schema will remove all associations with other credentials issued to users. Are you sure?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDelete} color="inherit">
                        No
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDeleteCredentialSchema(selectedId)} autoFocus>
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
                <DialogTitle id="alert-dialog-title">Delete Credential Schemas?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a credential schema will remove all associations with other credentials issued to users. Are you sure?
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
