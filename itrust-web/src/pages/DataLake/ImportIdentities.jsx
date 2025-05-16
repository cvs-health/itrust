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

import { Box, Button, Card, CardContent, CardHeader, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import * as XLSX from 'xlsx';
import StatusMessage from '../../components/StatusMessage';
import { Reply } from '@mui/icons-material';
import { saveIdentity } from '../../services/MockDataService';
import { useAuthContext } from '../../context/AuthContext';

export default function ImportIdentities() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const [rows, setRows] = useState([]);
    const [headers, setHeaders] = useState([]);
    const {user} = useAuthContext();

    const handleBack = () => {
        navigate(-1);
    };

    const handleFileUpload = (e) => {
        setLoading(true);
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const bstr = event.target.result;
            const workBook = XLSX.read(bstr, { type: "binary" });
            // Get the first sheet
            const workSheetName = workBook.SheetNames[0];
            const workSheet = workBook.Sheets[workSheetName];
            // convert into array of objects
            const data = XLSX.utils.sheet_to_json(workSheet, { header: 0, blankrows: false });
            setRows(data);
            //           console.log(data);

            const headers = Object.keys(data[0]);
            setHeaders(headers);
        };
        reader.readAsBinaryString(file);
        setLoading(false);
    };

    // Iterate through the rows and create the identities
    const handleConfirmImport = async() => {
        setLoading(true);
        const promises = rows.map(async (row) => {
            // Add/convert additional fields 
            row = {
                ...row,
                id : row.id,
                company: user?.tenant?.identifier,
                zipcode: row.zipcode.toString()
            }
            console.log ('Row: ', row);
            // lastly, create a json string of the row
            const jsonString = JSON.stringify(row);
            row.data = jsonString;

            return await saveIdentity(row);
        })
        // Wait for all promises to resolve
        await Promise.all(promises);
        setLoading(false);
        setStatus({ open: true, type: "success", message: `Imported ${rows.length} identities` });
       navigate('/identities/', { state: { refresh: Math.random() } });
    }


    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card width="50%">
                <CardHeader
                    title="Import Identities"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>
                                Upload a CSV or Excel file. The format of the file should be as follows:
                            </Typography>
                            <Typography variant='subtitle1'>
                                firstName,lastName,street,city,state,zipcode,country,dateOfBirth,email,phone,company,identityProvider,applicationName,accountId,identityType
                            </Typography>
                        </Box>
                    }
                    action={
                        <>
                            <Button startIcon={<Reply />} onClick={handleBack} color="warning">
                                Back
                            </Button>
                        </>
                    }
                />
                <Divider />
                <CardContent >
                    <form>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                            <TextField type="file" onChange={handleFileUpload} fullWidth variant="standard"/>
                            {/* <Button onClick={readExcel} color="primary" variant="contained">Upload</Button> */}
                        </Stack>

                    </form>
                    {rows && rows.length > 0 && (
                        <Box display="flex" flexDirection="column" mt= {4}>
                            <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" mb= {2} gap= {2}>
                                <Typography variant="headline">Preview File Contents</Typography>
                                <Button variant='contained' onClick={handleConfirmImport} color="primary">
                                Proceed with Upload
                            </Button>
                            </Box>
                            <TableContainer component={Paper}>
                                <Table aria-label="identities">
                                    <TableHead>
                                        <TableRow>
                                            {headers.map((column) => (
                                                <TableCell key={column}>{column}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <TableRow key={index}>
                                                {headers.map((column) => (
                                                    <TableCell key={`${index}-${column}`}>{row[column]}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}


                </CardContent>
                <Divider />

            </Card>
        </Box>
    )
}
