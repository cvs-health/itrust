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

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteCredentialSchema, findCredentialSchemaById } from "../../services/CredentialSchemaService";
import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Tab, Tabs, Typography } from "@mui/material";
import { GridLoader } from "react-spinners";
import StatusMessage from "../../components/StatusMessage";
import { Delete, Download, Edit, MoreVert, Reply } from "@mui/icons-material";
import CredentialSchemaAttributeTable from "./CredentialSchemaAttributeTable";
import TabPanel from "../../components/TabPanel";
import * as XLSX from 'xlsx';

export default function CredentialSchemaDetail(props) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const navigate = useNavigate();
    const { state } = useLocation();
    const { refresh } = { ...state };

    const [credentialSchema, setCredentialSchema] = useState();

    // Read the path param
    let { id: credentialschemaId } = useParams();
    const [tab, setTab] = useState(0);

    // confirmation dialogs
    const [openDelete, setOpenDelete] = useState(false);

    useEffect(() => {
        async function getCredentialSchema(credentialschemaId) {
            setLoading(true);
            // Check if credentialschema id is provide
            let results = null;
            if (credentialschemaId) {
                results = await findCredentialSchemaById(credentialschemaId);
            } else if (props.credentialschema) {
                results = props.credentialschema
            }
            console.log("Credential Schema: ", results);
            setCredentialSchema(results);
            if (!results) {
                setStatus({ open: true, type: "info", message: "No Credential Schema found" });
            }
            setLoading(false);
        }
        getCredentialSchema(credentialschemaId);
    }, [credentialschemaId, refresh]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = async () => {
        //console.log("Edit Credential Schema with id:  ", credentialschema?.ID);
        //setEditMode(true);
        //const t = await findCredentialSchemaById(credentialschema?.ID);
        navigate(`/credential_schema/edit/${credentialSchema?.ID}`, { state: { credentialSchema: credentialSchema } });
    };
    const handleOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleDelete = async () => {
        console.log("Delete CredentialSchema with id:  ", credentialSchema?.ID);
        const response = await deleteCredentialSchema(credentialSchema?.ID);
        handleCloseDelete();
        console.log("Delete Response: ", response);
        if (response) {
            setStatus({ open: true, type: "success", message: "Credential Schema Deleted" });
            setCredentialSchema(null);
        }
        navigate("/credential_schema");
    };

    const handleTabChange = (event, index) => {
        setTab(index);
    };

    const setCredentialSchemaAttributes = (newCredentialSchemaAttributes) => {
        setCredentialSchema({ ...credentialSchema, attributes: newCredentialSchemaAttributes });
    }

    const handleDownloadTemplate = () => {
        console.log("Download Template for Credential Schema with id:  ", credentialSchema?.ID);
        console.log ("Credential Schema Attributes: ", credentialSchema?.attributes);
        // Get an array of all attribute names and create an Excel File using XLSX. Use the schema name as 
        // the worksheet name and the attribute names as the headers. Name the file with the schema name_template and download the file 
        const attributeNames = credentialSchema?.attributes.map(attribute => attribute.name);
        // Add the "id" attribute to the list of attribute names as the first attribute
        attributeNames.unshift("person_id");
         
        console.log ("Attribute Names: ", attributeNames);
        // Create a new workbook
        const wb = XLSX.utils.book_new();
        // Create a new worksheet
        const ws = XLSX.utils.aoa_to_sheet([attributeNames]);
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, credentialSchema?.name);
        // Save the workbook as a file
        XLSX.writeFile(wb, `${credentialSchema?.name}_schema_template.xlsx`);
    }


    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card elevation={0}>
                <CardHeader
                    title={`${credentialSchema?.name} Details`}
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>View credential schema details</Typography>
                        </Box>
                    }
                    action={
                        <>
                            {credentialSchema && (
                                <>
                                <Button startIcon={<Download />} onClick={handleDownloadTemplate} color="primary" disabled={credentialSchema ? false : true}>
                                        Download Template
                                    </Button>
                                    <Button startIcon={<MoreVert />} />
                                    <Button startIcon={<Edit />} onClick={handleEdit} color="primary" disabled={credentialSchema ? false : true}>
                                        Edit
                                    </Button>
                                    <Button startIcon={<Delete />} onClick={handleOpenDelete} color="secondary" disabled={credentialSchema ? false : true}>
                                        Delete
                                    </Button>
                                </>
                            )}
                            <Button startIcon={<Reply />} onClick={handleBack} color="warning">
                                Back
                            </Button>
                        </>
                    }
                />
                <Divider />
            </Card>

            <Card>
                <CardContent>
                    <Tabs value={tab} onChange={handleTabChange} aria-label="Tenant Details" indicatorColor="secondary">
                        <Tab label="General" />
                        <Tab label="Attributes" />
                    </Tabs>
                    {tab === 0 && (
                        <TabPanel>
                            <Box sx={{ display: "flex", flexDirection: "row" }}>
                                <Box sx={{ display: "flex", flexDirection: "column" }} width="30%">
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Name
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {credentialSchema?.name || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Code
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {credentialSchema?.code || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Version
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {credentialSchema?.version || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Description
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {credentialSchema?.description || "N.A."}
                                    </Typography>
                                    <Typography variant="body1" fontWeight={"bold"}>
                                        Status
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {credentialSchema?.status || "N.A."}
                                    </Typography>

                                </Box>
                           

                            <Box sx={{ display: "flex", flexDirection: "column" }} width="30%">
                            <Typography variant="body1" fontWeight={"bold"}>
                                        Credential Type(s)
                                    </Typography>

                                    {credentialSchema?.credentialTypes?.map((credentialType, index) => (
                                        <Typography key={index} variant="body1" gutterBottom>
                                            {credentialType.name}
                                        </Typography>
                                    ))}
                            </Box>
                            </Box>
                        </TabPanel>
                    )}
                    {tab === 1 && (
                        <TabPanel>
                            <CredentialSchemaAttributeTable credentialSchemaAttributes={credentialSchema?.attributes} setCredentialSchemaAttributes={setCredentialSchemaAttributes}/>
                        </TabPanel>
                    )}
                </CardContent>
            </Card>

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
                    <Button variant="contained" color="secondary" onClick={handleDelete} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
