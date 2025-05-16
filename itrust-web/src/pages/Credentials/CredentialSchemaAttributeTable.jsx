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

import { DataGrid, GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";
import { ROWS_PER_PAGE } from "../../constants";

import { useAuthContext } from "../../context/AuthContext";
import { deleteCredentialSchemaAttribute, findCredentialSchemaAttributeById } from "../../services/CredentialSchemaService";

export default function CredentialSchemaAttributeTable({ credentialSchemaAttributes, setCredentialSchemaAttributes }) {
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
        setRows(credentialSchemaAttributes);
    }, [credentialSchemaAttributes]);

    const handleEditCredentialSchemaAttribute = (id) => async () => {
        // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
        // get the credentialSchema with id 
        const credentialSchemaAttribute = await findCredentialSchemaAttributeById(id);
        console.log ('Sending Credential Schema Attribute: ', credentialSchemaAttribute)
        // navigate(`/credential_schema_attribute/edit/${id}`, { state: { credentialSchemaAttribute: credentialSchemaAttribute } });
    };

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
            field: "displayName",
            headerName: "Display Name",
            width: "200",
            editable: false,
        },
        {
            field: "Datatype",
            headerName: "Datatype",
            width: "100",
            editable: false,
        },
        {
            field: "required",
            headerName: "Required",
            width: "100",
            editable: false,
            renderCell: (cell) => {
                return cell.row.required ? "Yes" : "No";
            }
        },
        {
            field: "order",
            headerName: "Order",
            width: "300",
            editable: false,
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
                    // <GridActionsCellItem
                    //     icon={<Edit color="primary" />}
                    //     label="Edit"
                    //     className="textPrimary"
                    //     onClick={handleEditCredentialSchemaAttribute(id)}
                    //     color="inherit"
                    // />,
                    <GridActionsCellItem icon={<Delete color="secondary" />} label="Delete" onClick={() => handleOpenDelete(id)} color="inherit" />,
                ];
            },
        },
    ];

  
    function NoRowsOverlay() {
        return (
            <Box display="flex" flexDirection="column" justifyContent={"center"} alignItems={"center"}>
                <Typography sx={{ padding: 2 }}>No Credential Schema Attributes found</Typography>
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

    function getRowId(row) {
        return row.ID;
    }

    const handleDeleteCredentialSchemaAttribute = (id) => async () => {
        await deleteCredentialSchemaAttribute(id);
        handleCloseDelete();

        // Remove the deleted credentialSchema from the list
        const newCredentialSchemaAttributes = credentialSchemaAttributes.filter((row) => row.ID !== id);
        setCredentialSchemaAttributes(newCredentialSchemaAttributes);

        setStatus({ open: true, type: "success", message: "Deleted Credential Schema Attribute" });
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
                // slots={{
                //     toolbar: CredentialSchemaTableToolbar,
                //     noRowsOverlay: NoRowsOverlay,
                // }}
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
                <DialogTitle id="alert-dialog-title">Delete Credential Schema Attribute?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting a Credential Schema Attribute will remove all associations with other people and organizations. Are you sure?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDelete} color="inherit">
                        No
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDeleteCredentialSchemaAttribute(selectedId)} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            
        </div>
    );
}
