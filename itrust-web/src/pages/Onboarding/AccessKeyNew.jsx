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

import { Alert, Box, Button, Card, CardContent, CardHeader, Divider, Link, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import { Reply } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AccessKeyNew() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const { state } = useLocation();
    const { accessKey } = { ...state };

    useEffect(() => {
        if (!accessKey) {
            navigate('/tenants/access_keys');
        }
        // console.log ('Access Key: ', accessKey);
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    // Download the Access keys as a JSON file
    const handleDownload = () => {
        const element = document.createElement("a");
        const { clientId, clientSecret } = accessKey;
        const file = new Blob([JSON.stringify({ clientId, clientSecret })], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        element.download = "itrust_access_key.json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
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
                    title="New Access Key"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>Your new access key has been created</Typography>
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
                    <Alert severity="success" sx={{ mb: 4 }}>
                        <Typography variant='headline' color="success.main">Success</Typography>
                        <Typography variant='body1'>This is the only time that your access key secret can be viewed or downloaded. You cannot recover them later. Save or download your new access key and secret to a save location.</Typography>
                    </Alert>
                    <Box sx={{ display: "flex", flexDirection: "column" }} width="50%">
                        <Typography variant="body1" fontWeight={"bold"}>
                            Client Id
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {accessKey?.clientId || "N.A."}
                        </Typography>
                        <Typography variant="body1" fontWeight={"bold"}>
                            Client Secret
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {accessKey?.clientSecret || "N.A."}
                        </Typography>
                        <Link onClick={handleDownload}>
                            Download Access Key
                        </Link>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}
