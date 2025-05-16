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

import { Cancel } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CardHeader, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import { handleFormChange } from '../../utils/FormUtils';
import { findTenantById } from '../../services/TenantService';
import { useAuthContext } from '../../context/AuthContext';
import { createExternalIdentities } from '../../services/MockDataService';

export default function MockPersonForm({ setShowMock, setStatus }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [tenant, setTenant] = useState({});

    const [formData, setFormData] = useState({
        count: 1,
        company: "",
        type: ""
    });

    useEffect(() => {
        async function getTenant() {
            setLoading(true);
            const t = await findTenantById(user.tenantId);
            setTenant(t)
            setFormData({ ...formData, company: t?.identifier });
            setLoading(false);
        }
        getTenant();
    }, []);


    const handleSubmit = async () => {
        setLoading(true);
        const criteria = {
            count: parseInt(formData.count),
            company: formData.company, 
            type: formData?.type
        }
        
        const response = await createExternalIdentities(criteria);
        //console.log('Response: ', response)
        setStatus({ open: true, type: "success", message: `Created ${criteria.count} people` });
        setLoading(false);
        handleClose()
    }

    const handleClose = async () => {
        setShowMock(false);
        navigate('/identities/', { state: { refresh: Math.random() } });
    }

    const handleCancel = async () => {
        setShowMock(false);
        // navigate('/identities/');
    }

    return loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", width: "30vw", height: "70vh", justifyContent: "center", alignItems: "center" }}>
            <GridLoader color="#cc0404" />
            <Typography variant="subtitle" mt={4}>
                Creating mock data...
            </Typography>
        </Box>
    ) : (
        <Card elevation={0}>
            <CardHeader
                title='Create Mock Data'
                titleTypographyProps={{ color: "primary.main", variant: "title" }}
                subheader='Create mock data to create identities and credentials'

                action={
                    <Button startIcon={<Cancel />} color="warning" onClick={handleClose}>
                        Close
                    </Button>
                }
            />
            <CardContent>
                <form>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <TextField
                            name="count"
                            type="number"
                            label="Number of People"
                            required
                            fullWidth
                            variant="standard"
                            value={formData.count ?? 1}
                            onChange={(e) => handleFormChange(setFormData, e)}
                        />
                        <TextField
                            name="company"
                            label="Organization Name"
                            required
                            fullWidth
                            variant="standard"
                            value={formData.company ?? ""}
                            onChange={(e) => handleFormChange(setFormData, e)}
                        />
                        <TextField
                            name="type"
                            label="Type"
                            required
                            fullWidth
                            variant="standard"
                            value={formData.type ?? ""}
                            onChange={(e) => handleFormChange(setFormData, e)}
                        />
                    </Box>
                </form>

            </CardContent>
            <CardActions
                    //disableSpacing
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Create Mock Data
                    </Button>
                </CardActions>
        </Card>
    )
}
