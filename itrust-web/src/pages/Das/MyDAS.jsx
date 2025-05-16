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
import { deleteDAS, findDASById } from "../../services/DASService";
import { Box, Button, Card, CardHeader, Divider, Typography } from "@mui/material";
import { GridLoader } from "react-spinners";
import StatusMessage from "../../components/StatusMessage";
import { Delete, Edit, Reply } from "@mui/icons-material";
import DASDetail from "./DASDetail";
import DASNew from "./DASNew";
import { useAuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../services/UserService";

export default function MyDAS() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const navigate = useNavigate();
    const { state } = useLocation();
    const { refresh } = { ...state };
    const [das, setDas] = useState();
    const { user, permissions } = useAuthContext();

    // Read the path param
    let { id: dasId } = useParams();
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        async function getDas() {
            setLoading(true);
            // console.log ('User: ', user)
            // Check if the user has the tenantId 
            let das = null;
            if (user?.dasId) {
                das = await findDASById(user.dasId);
            }
            if (das) {
                setDas(das);
                setEditMode(false);
                setStatus({ open: false, type: "info", message: "Found your DAS" });
            } else {
                setDas(null);
                setEditMode(true);
                setStatus({ open: true, type: "info", message: "No DAS found" });
            }
            setLoading(false);
            //console.log ("DAS: ", results);
        }

        getDas();
    }, [user, refresh]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleDelete = async () => {
        console.log("Delete DAS with id:  ", das?.ID);
        const response = await deleteDAS(das?.ID);
        console.log("Delete Response: ", response);
        if (response) {
            setStatus({ open: true, type: "success", message: "DAS Deleted" });
            setDas(null);
        }
    };

    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card elevation={0}>
                <CardHeader
                    title="My DAS"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>
                                Digital Address Service enables the identity and business transactions between issuers, service providers and users
                                using a combination of on-Ledger and off-Ledger services to facilitate the capabilities of verifying credentials for
                                relying parties.
                            </Typography>
                        </Box>
                    }
                    action={
                        <>
                            {das && (
                                <>
                                    {hasPermission(permissions, "das.update") && (
                                        <Button startIcon={<Edit />} onClick={handleEdit} color="primary" disabled={das ? false : true}>
                                            Edit
                                        </Button>
                                    )}
                                    {hasPermission(permissions, "das.delete") && (
                                        <Button startIcon={<Delete />} onClick={handleDelete} color="secondary" disabled={das ? false : true}>
                                            Delete
                                        </Button>
                                    )}
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
            {editMode && <DASNew das={das} setEditMode={setEditMode} />}
            {editMode && !das && <DASNew/>}
            {!editMode && das && <DASDetail das={das} />}
        </Box>
    );
}
