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

import { Cancel, Mail } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import { handleFormChange } from '../../utils/FormUtils';
import { findTenantById } from '../../services/TenantService';
import { useAuthContext } from '../../context/AuthContext';
import { createExternalIdentities, createMockInterviewSchedules } from '../../services/MockDataService';
import { findCredentialSchemaByCodeAndVersion } from '../../services/CredentialSchemaService';
import MockUserDataTable from '../../pages/User/MockUserDataTable';
import { fireInterviewScheduleEvent } from './CandidateService';

export default function MockInterviewSchedulePanel({ identity, setShowMockSchedule, setStatus }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext();


    const INTERVIEW_SCHEMA_NAME = "adia.schema.interview"
    const INTERVIEW_SCHEMA_VERSION = "1.0"
    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState({});
    const [credentialSchema, setCredentialSchema] = useState({});

    useEffect(() => {
        async function getInterviewSchedules() {
            setLoading(true);
            const criteria = {
                count: 2,
                company: user?.tenant?.organization?.identifier,
                firstName: identity?.firstName,
                lastName: identity?.lastName,
            }
            const interviews = await createMockInterviewSchedules(criteria);
            setRecords(interviews);
            // console.log('Interviews: ', interviews)
            const schema = await findCredentialSchemaByCodeAndVersion(INTERVIEW_SCHEMA_NAME, INTERVIEW_SCHEMA_VERSION);
            setCredentialSchema(schema);
            // console.log('Schema: ', schema)
            setLoading(false);
        }
        getInterviewSchedules();
    }, []);

    const sendConfirmation = async (identity, schedule) => {
        const payload = {
            "eventType": "ApplicationEvent",
            "eventSubType": "NotificationEvent",
            "title": "Interview Confirmation with " + user?.tenant?.organization?.name,
            "data": {
                channel: "mail",
                subject: "Interview Confirmation with " + user?.tenant?.organization?.name,
                to: `${identity?.firstName} ${identity?.lastName} <${identity?.email}>`,
                firstName: identity?.firstName,
                tenantName: user?.tenant?.organization?.name,
                template: "candidate.schedule_interview",
                schedule: schedule
            }
        }
        fireInterviewScheduleEvent(payload);
        setStatus({ open: true, type: "success", message: `Interview confirmation sent to ${identity?.firstName} ${identity?.lastName}` });
    }

    const handleClose = async () => {
        console.log ('Issued Credential: ', selectedRecord)
        sendConfirmation(identity, selectedRecord);
        setShowMockSchedule(false);
        navigate('/demo/candidates/', { state: { refresh: Math.random() } });
    }

    return loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", width: "50vw", height: "70vh", justifyContent: "center", alignItems: "center" }}>
            <GridLoader color="#cc0404" />
            <Typography variant="subtitle" mt={4}>
                Creating mock data...
            </Typography>
        </Box>
    ) : (
        <Card elevation={0}>
            <CardHeader
                title='Interview Schedule'
                titleTypographyProps={{ color: "primary.main", variant: "title" }}
                subheader='Mock data to view and schedule interviews'

                action={
                    <>
                        <Button color="warning" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" startIcon={<Mail />} color="primary" onClick={handleClose}>
                            Send Notification
                        </Button>

                    </>
                }
            />
            <Divider />
            <CardContent>
                {credentialSchema && records && records.length > 0 &&
                    <MockUserDataTable identity={identity} schema={credentialSchema} records={records} setShowMock={false} setStatus={setStatus} setSelectedRecord={setSelectedRecord} />}

            </CardContent>

        </Card>
    )
}
