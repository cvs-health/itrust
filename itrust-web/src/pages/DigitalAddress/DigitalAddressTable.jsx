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

import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import StatusMessage from "../../components/StatusMessage";
import { DATE_FORMAT, ROWS_PER_PAGE } from "../../constants";

import { format, parseISO } from "date-fns";

export default function DigitalAddressTable({ digitalAddresses}) {
    const [rows, setRows] = useState([]);

    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });


    useEffect(() => {
        setRows(digitalAddresses);
    }, [digitalAddresses]);

    const columns = [
        {
            field: "CreatedAt",
            headerName: "Created Date",
            width: "100",
            editable: false,
            valueGetter: (cell) => {
                return cell.row.CreatedAt ? format(parseISO(cell.row.CreatedAt), DATE_FORMAT) : "";
            },
        },
        {
            field: "entityDID",
            headerName: "Entity DID",
            width: "350",
            flex:1,
            editable: false,

        },
        {
            field: "entityDigitalAddress",
            headerName: "Entity Digital Address",
            width: "200",
            editable: false,

        },
        {
            field: "issuerDID",
            headerName: "Issuer DID",
            width: "350",
            flex:1,
            editable: false,

        },
        {
            field: "issuerDigitalAddress",
            headerName: "Issuer Digital Address",
            width: "200",
            editable: false,

        },
        {
            field: "assuranceLevel",
            headerName: "Assurance Level",
            width: "80",
            editable: false,

        },




    ];


    // Returns a custom tool bar for the identity table
    function DigitalAddressTableToolbar() {
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
                    <GridToolbarExport />
                </Box>
            </GridToolbarContainer>
        );
    }

    function NoRowsOverlay() {
        return (
            <Box display="flex" flexDirection="column" justifyContent={"center"} alignItems={"center"}>
                <Typography sx={{ padding: 2 }}>No digitalAddresses found</Typography>
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
                disableRowSelectionOnClick
                autoHeight
                slots={{
                    toolbar: DigitalAddressTableToolbar,
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
