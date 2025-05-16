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
/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import StatusMessage from '../../components/StatusMessage';
import { DataGrid, GridActionsCellItem, GridRowModes, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { DATE_FORMAT, ROWS_PER_PAGE } from '../../constants'
import { format, parseISO } from 'date-fns';

export default function ConnectionTable({ connections, setConnections, deleteConnection }) {
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

    useEffect(() => {
        setRows(connections);
    }, [connections]);

    function NoRowsOverlay() {
        return (
            <Box display="flex" flexDirection="column" justifyContent={"center"} alignItems={"center"}>
                <Typography sx={{ padding: 2 }}>No connections found</Typography>
            </Box>
        );
    }

    function getRowId(row) {
        return row.ID;
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

    const handleDeleteConnection = (id) => async () => {
        deleteConnection(id);
        handleCloseDelete();

        // Remove the deleted connection from the list
        const newConnections = rows.filter((row) => row.ID !== id);
        setConnections(newConnections);

        setStatus({ open: true, type: "success", message: "Deleted Connection" });
    };

    const handleDeleteMultiple = async() => {
        console.log ('Selected Rows: ', selectedRows)
        if (selectedRows) {

            const promises = selectedRows.map(async (id) => {
                let promise = await deleteConnection(id);
                return promise
            });
            // Wait for all promises to resolve
            await Promise.all(promises);

            handleCloseMultipleDelete()
            // Remove the deleted connections from the list 
            const newConnections = connections.filter((row) => !selectedRows.includes(row.ID));
            setConnections(newConnections);

            setStatus({ open: true, type: "success", message: "Deleted Connection(s)" });
        }
    };

    // Returns a custom tool bar for the identity table
    function ConnectionTableToolbar() {
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
                    {/* <Button startIcon={<MoreVert />} /> */}
                    <GridToolbarExport />
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

    const columns = [

        {
            field: "To",
            headerName: "To",
            width: "150",
            editable: false,
            renderCell: (cell) => {
                return <Link to={`/connections/${cell.id}`}>{cell.row.toParty.name}</Link>;
            },
        },
        {
            field: "digitalAddress",
            headerName: "Digital Address",
            width: "150",
            editable: false,
            valueGetter: (cell) => {
                return cell.row.toParty?.digitalAddress ?? "";
            },
        },
        {
            field: "DID",
            headerName: "DID",
            width: "350",
            editable: false,
            valueGetter: (cell) => {
                return cell.row.toParty?.did ?? "";
            },
        },
        {
            field: "partyRelationType",
            headerName: "Relation",
            width: "150",
            editable: false,

        },
        {
            field: "Since",
            headerName: "Since",
            width: "150",
            editable: false,
            valueGetter: (cell) => {
                return format(parseISO(cell.row.UpdatedAt), DATE_FORMAT) ?? "";
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
                    <GridActionsCellItem icon={<Delete color="secondary" />} label="Delete" onClick={() => handleOpenDelete(id)} color="inherit" />,
                ];
            },
        },

    ]

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
                    toolbar: ConnectionTableToolbar,
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
                selectionModel={selectedRows}
            //onRowSelectionModelChange={handleSelectionModelChange}
            />
            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={handleCloseDelete} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Delete connection?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a connection will remove all associations with other people. Are you sure?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDelete} color="inherit">
                        No
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDeleteConnection(selectedId)} autoFocus>
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
                <DialogTitle id="alert-dialog-title">Delete connections?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting connections will remove all associations with other people. Are you sure?
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
