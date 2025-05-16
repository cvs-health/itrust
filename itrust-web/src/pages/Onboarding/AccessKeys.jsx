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

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Box, Button, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import { Reply } from '@mui/icons-material';
import AccessKeyTable from './AccessKeyTable';
import { findAccessKeys } from '../../services/AccessKeyService';

export default function AccessKeys() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const navigate = useNavigate();
    let { id: tenantId } = useParams();
    const { user, permissions, isInitialized } = useAuthContext();
    const [accessKeys, setAccessKeys] = useState([]);
    const { state } = useLocation();
    const { refresh } = { ...state };

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        async function getAccessKeys() {
            setLoading(true);
            const results = await findAccessKeys(user?.tenantId);
            setAccessKeys(results);
            setLoading(false);
        }

        getAccessKeys();
    }, [refresh]);


    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card elevation={0}>
                <CardHeader
                    title="Access Keys"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>Access keys can be used to programmatically access iTrust services.</Typography>
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
            </Card>
            <Card>
                <CardContent>
                    {
                        <AccessKeyTable accessKeys={accessKeys} setAccessKeys={setAccessKeys} />}
                </CardContent>
            </Card>



        </Box>
    )
}
