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
import { AddCircle, Delete, MoreVert, Refresh } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";
import { DATETIME_FORMAT, ROWS_PER_PAGE } from "../../constants";
import { deleteAccessKey } from "../../services/AccessKeyService";

import { useAuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../services/UserService";
import { format, parseISO } from "date-fns";
import { saveAccessKey } from "../../services/AccessKeyService";

export default function AccessKeyTable({ accessKeys, setAccessKeys }) {
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
    const {user, permissions } = useAuthContext();

    useEffect(() => {
        setRows(accessKeys || []);
    }, [accessKeys]);

    const columns = [
        {
            field: "clientId",
            headerName: "Client ID",
            width: "150",
            editable: false
        },
        {
            field: "CreatedAt",
            headerName: "Created Date",
            width: "200",
            editable: false,
            valueGetter: (cell) => {
                return cell.row.CreatedAt ? format(parseISO(cell.row.CreatedAt), DATETIME_FORMAT) : "";
            },
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

    const handleRefresh = () => {
        navigate("/tenants/access_keys", { state: { refresh: Math.random() } });
    }

    const handleAddAccessKey = async () => {
        const accessKey = await saveAccessKey(user?.tenantId);
        navigate("/tenants/access_keys/new", { state: { accessKey: accessKey } });
    };


    const handleDeleteAccessKey = (id) => async () => {
        console.log ('Delete access key: ', id)
        // From the list of accesskeys, get the key with the ID
        const key = accessKeys.find((row) => row.ID === id);
        await deleteAccessKey(user?.tenantId, key.clientId);
        handleCloseDelete();
        navigate("/tenants/access_keys", { state: { refresh: Math.random() } });

        setStatus({ open: true, type: "success", message: "Deleted AccessKey" });
    };

    const handleDeleteMultiple = async() => {
        console.log ('Selected Rows: ', selectedRows)
        if (selectedRows) {

            const promises = selectedRows.map(async (id) => {
                const key = accessKeys.find((row) => row.ID === id);
                let promise = await deleteAccessKey(user?.tenantId, key.clientId);
                return promise
            });
            // Wait for all promises to resolve
            await Promise.all(promises);

            handleCloseMultipleDelete()
            // Remove the deleted accessKeys from the list 
            const newAccessKeys = accessKeys.filter((row) => !selectedRows.includes(row.ID));
            setAccessKeys(newAccessKeys);

            setStatus({ open: true, type: "success", message: "Deleted AccessKey(s)" });
        }
    };

    const handleSelectionModelChange = (selectedIds) => {
        setSelectedRows(selectedIds);
    };

    

    // Returns a custom tool bar for the identity table
    function AccessKeyTableToolbar() {
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
                    hasPermission(permissions, "tenant.manage") &&  <Button startIcon={<AddCircle />} onClick={handleAddAccessKey}>
                        New AccessKey
                    </Button>
                    }
                    <Button startIcon={<MoreVert />} />
                    <Button
                        startIcon={<Refresh  />}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                    
                    {hasPermission(permissions, "tenant.manage") &&  <Button
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
                <Typography sx={{ padding: 2 }}>No access keys found</Typography>
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
                    toolbar: AccessKeyTableToolbar,
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
                // Called on checkbox selection
                selectionModel={selectedRows}
                onRowSelectionModelChange={handleSelectionModelChange}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Delete access key?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a access key will disable all clients using the key. Are you sure?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDelete} color="inherit">
                        No
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDeleteAccessKey(selectedId)} autoFocus>
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
                <DialogTitle id="alert-dialog-title">Delete access keys?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting access keys will disable all clients using the key. Are you sure?
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
