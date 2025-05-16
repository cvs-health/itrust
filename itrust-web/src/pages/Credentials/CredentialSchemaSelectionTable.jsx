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

import { DataGrid, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";
import { ROWS_PER_PAGE } from "../../constants";
import { AddCircle, Delete } from "@mui/icons-material";


export default function CredentialSchemaSelectionTable({ tenantId, credentialSchemas, addAllowedCredentials }) {
    const [rows, setRows] = useState([]);

    const [selectedRows, setSelectedRows] = useState([]);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });

    useEffect(() => {
        setRows(credentialSchemas);
    }, []);

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

    ];

    const handleDone = async () => {
        addAllowedCredentials(selectedRows)
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
                <Button variant="contained" startIcon={<AddCircle />} onClick={handleDone}>
                    Allow
                </Button>
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
                // Called on checkbox selection
                selectionModel={selectedRows}
                onRowSelectionModelChange={handleSelectionModelChange}
            />


        </div>
    );
}
