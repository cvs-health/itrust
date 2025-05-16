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
import React, { useState } from 'react'
import StatusMessage from '../../components/StatusMessage';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { DATETIME_FORMAT, ROWS_PER_PAGE } from '../../constants'
import { format, parseISO } from 'date-fns';

export default function ConnectionHistoryTable() {
    const [rows, setRows] = useState([
        { ID: 1, CreatedAt: "2024-01-01T08:00:00-05:00", description: "Connection established" },
        { ID: 2, CreatedAt: "2024-01-01T08:00:01-05:00", description: "Shared Identity Credential - Drivers License" },
        { ID: 3, CreatedAt: "2024-01-01T08:00:02-05:00", description: "Shared Education Credential - Stanford Univ" },
        { ID: 4, CreatedAt: "2024-01-02T10:50:01-05:00", description: "Shared Identity Credential - Passport" },
        { ID: 5, CreatedAt: "2024-01-02T10:50:02-05:00", description: "Shared Patient Identity Credential - Minute Clinic" },
        { ID: 6, CreatedAt: "2024-01-02T10:50:02-05:00", description: "Shared Allergy Credential - Pollen" },
        { ID: 7, CreatedAt: "2024-01-02T10:50:02-05:00", description: "Shared Medication Credential - Amlodipine" },
        { ID: 8, CreatedAt: "2024-01-02T10:50:02-05:00", description: "Shared Medication Credential - Lipitor" },
    ]);
    
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });

    // useEffect(() => {
    //     setRows(connections);
    // }, [connections]);

    function NoRowsOverlay() {
        return (
            <Box display="flex" flexDirection="column" justifyContent={"center"} alignItems={"center"}>
                <Typography sx={{ padding: 2 }}>No history found</Typography>
            </Box>
        );
    }

    function getRowId(row) {
        return row.ID;
    }


    // Returns a custom tool bar for the identity table
    function ConnectionHistoryTableToolbar() {
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

                </Box>
            </GridToolbarContainer>
        );
    }

    const columns = [
        {
            field: "Date",
            headerName: "Date",
            width: "200",
            editable: false,
            valueGetter: (cell) => {
                return format(parseISO(cell.row.CreatedAt), DATETIME_FORMAT) ?? "";
            },
        },
        
        {
            field: "description",
            headerName: "Description",
            width: "500",
            editable: false,
            valueGetter: (cell) => {
                return cell.row.description ?? "";
            },
        }


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
                //checkboxSelection
                disableRowSelectionOnClick
                autoHeight
                slots={{
                    toolbar: ConnectionHistoryTableToolbar,
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

            />


        </div>
    );
}
