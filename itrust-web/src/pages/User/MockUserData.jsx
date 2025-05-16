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
import { Box, Button, Card, CardContent, CardHeader, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { GridLoader } from 'react-spinners';
import { findCredentialSchemas } from '../../services/CredentialSchemaService';
import MockUserDataTable from './MockUserDataTable';
import TabPanel from '../../components/TabPanel';
import { CREDENTIAL_SCHEMA_ALLERGY, CREDENTIAL_SCHEMA_EDUCATION, CREDENTIAL_SCHEMA_IDENTITY, CREDENTIAL_SCHEMA_IMMUNIZATION, CREDENTIAL_SCHEMA_MEDICAL_CONDITION, CREDENTIAL_SCHEMA_MEDICAL_INSURANCE, CREDENTIAL_SCHEMA_MEDICATION, CREDENTIAL_SCHEMA_PATIENT_IDENTITY, CREDENTIAL_SCHEMA_PROFESSIONAL_LICENSE, CREDENTIAL_SCHEMA_WORK } from '../../constants';
import { createMockPerson } from '../../services/MockDataService';
import { useNavigate } from 'react-router-dom';
import { findTenantAllowedCredentials } from '../../services/TenantService';
import { useAuthContext } from '../../context/AuthContext';
import * as Constants from '../../constants';

export default function MockUserData({ identity, setShowMock, setStatus }) {
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(0);
    const [credentialSchemas, setCredentialSchemas] = useState([]);
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const [credentialSchema, setCredentialSchema] = useState();
    const [records, setRecords] = useState([]);
    const [workCredentials, setWorkCredentials] = useState([]);
    const [patientIdentityCredentials, setPatientIdentityCredentials] = useState([]);
    const [professionalLicenseCredentials, setProfessionalLicenseCredentials] = useState([]);
    const [educationCredentials, setEducationCredentials] = useState([]);
    const [allergyCredentials, setAllergyCredentials] = useState([]);
    const [medicationCredentials, setMedicationCredentials] = useState([]);
    const [immunizationCredentials, setImmunizationCredentials] = useState([]);
    const [medicalConditionCredentials, setMedicalConditionCredentials] = useState([]);
    const [medicalInsuranceCredentials, setMedicalInsuranceCredentials] = useState([]);
    const [interviewCredentials, setInterviewCredentials] = useState([]);
    const [trainingCredentials, setTrainingCredentials] = useState([]);

    useEffect(() => {
        async function getCredentialSchemas() {
            setLoading(true);
            const results = await findCredentialSchemas();
            // Remove the item with name CREDENTIAL_SCHEMA_IDENTITY
            let filtered = results.filter((schema) => schema.code !== CREDENTIAL_SCHEMA_IDENTITY);
            const allowedSchemas = await findTenantAllowedCredentials(user?.tenantId)
            // console.log ('Allowed Schemas: ', allowedSchemas)
            // Filter the filtered schema if allowedSchema.credentialSchema has the same schema.code 
            filtered = filtered.filter(schema => allowedSchemas.some(allowedSchema => allowedSchema.credentialSchema.code === schema.code))

            setCredentialSchemas(filtered);

            // Get the mock data for the user
            console.log('Identity: ', identity)
            const criteria = {
                count: 1,
                company: user?.tenant?.identifier,
                type: identity?.identityType,
                firstName: identity?.firstName,
                lastName: identity?.lastName,
            }

            const mockPeople = await createMockPerson(criteria);
            // await getMockData(mockPeople[0]);
            getMockData(mockPeople[0]);

            // Set the initial schema as the first item in the list
            setCredentialSchema(filtered[0]);
            setTimeout(() => {
                setTab(0);
                setLoading(false);
            }, Constants.STANDARD_DELAY);
        }

        function getMockData(mockPerson) {
            var person = (identity?.data) ? JSON.parse(identity?.data) : {}

            const workCredentials = person?.work ? person?.work : mockPerson?.work;
            setWorkCredentials(workCredentials);
            setRecords(workCredentials);

            const patientIdentityCredentials = person?.patientIdentity ? person?.patientIdentity : mockPerson?.patientIdentity;
            setPatientIdentityCredentials(patientIdentityCredentials);

            const professionalLicenseCredentials = person?.professionalLicenses ? person?.professionalLicenses : mockPerson?.professionalLicenses;
            setProfessionalLicenseCredentials(professionalLicenseCredentials);

            const educationCredentials = person?.educations ? person?.educations : mockPerson?.educations;
            setEducationCredentials(educationCredentials);

            const allergyCredentials = person?.allergies ? person?.allergies : mockPerson?.allergies;
            setAllergyCredentials(allergyCredentials);

            const immunizationCredentials = person?.immunizations ? person?.immunizations : mockPerson?.immunizations;
            setImmunizationCredentials(immunizationCredentials);

            const medicationCredentials = person?.medications ? person?.medications : mockPerson?.medications;
            setMedicationCredentials(medicationCredentials);

            const medicalConditionCredentials = person?.medicalConditions ? person?.medicalConditions : mockPerson?.medicalConditions;
            setMedicalConditionCredentials(medicalConditionCredentials);

            const medicalInsuranceCredentials = person?.medicalInsurance ? person?.medicalInsurance : mockPerson?.medicalInsurance;
            setMedicalInsuranceCredentials(medicalInsuranceCredentials);

            const interviewCredentials = person?.interviews ? person?.interviews : mockPerson?.interviews;
            setInterviewCredentials(interviewCredentials);

            const trainingCredentials = person?.trainings ? person?.trainings : mockPerson?.trainings;
            setTrainingCredentials(trainingCredentials);
        }

        setLoading(true);
        getCredentialSchemas();
        // setTimeout(() => {
        //     setLoading(false);
        // }, 1000);
    }, [identity])

    const handleClose = async () => {
        setShowMock(false);
        navigate(`/identities/${identity?.ID}`, { state: { refresh: Math.random(), showTab: 1 } });
    }

    const handleTabChange = (event, index) => {
        setTab(index);
        // Get the credentials schema for the selected index 
        const schema = credentialSchemas[index];
        setCredentialSchema(schema);
        if (schema?.code === CREDENTIAL_SCHEMA_WORK) {
            setRecords(workCredentials);
        } else if (schema?.code === CREDENTIAL_SCHEMA_PATIENT_IDENTITY) {
            setRecords(patientIdentityCredentials);
        } else if (schema?.code === CREDENTIAL_SCHEMA_PROFESSIONAL_LICENSE) {
            setRecords(professionalLicenseCredentials);
        } else if (schema?.code === CREDENTIAL_SCHEMA_EDUCATION) {
            setRecords(educationCredentials);
        } else if (schema?.code === CREDENTIAL_SCHEMA_ALLERGY) {
            setRecords(allergyCredentials);
        } else if (schema?.code === CREDENTIAL_SCHEMA_IMMUNIZATION) {
            setRecords(immunizationCredentials);
        } else if (schema?.code === CREDENTIAL_SCHEMA_MEDICAL_CONDITION) {
            setRecords(medicalConditionCredentials);
        } else if (schema?.code === CREDENTIAL_SCHEMA_MEDICATION) {
            setRecords(medicationCredentials);
        } else if (schema?.code === CREDENTIAL_SCHEMA_MEDICAL_INSURANCE) {
            setRecords(medicalInsuranceCredentials);
        } else if (schema?.code === Constants.CREDENTIAL_SCHEMA_INTERVIEW) {
            setRecords(interviewCredentials);
        } else if (schema?.code === Constants.CREDENTIAL_SCHEMA_TRAINING) {
            setRecords(trainingCredentials);
        }

    };

    return loading ? (
        <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
            <Typography variant="subtitle" mt={4}>
                Getting mock data for user ...
            </Typography>
        </Box>
    ) : (
        <Card elevation={0}>
            <CardHeader
                title={`Mock data for ${identity?.firstName} ${identity?.lastName}`}
                titleTypographyProps={{ color: "primary.main", variant: "title" }}
                subheader={identity?.did ? 'Select the data in your enterprise systems to issue verifiable credentials. Your Digital Signature will be used to sign the credentials to prove its authenticity.' :
                    'You need to create a Digital Address for this user to issue verifiable credentials. '}
                subheaderTypographyProps={{ variant: "body1", color: identity?.did ? "grey" : "warning.main" }}
                action={
                    <Button startIcon={<Cancel />} color="warning" onClick={handleClose}>
                        Close
                    </Button>
                }
            />
            {credentialSchemas &&
                <CardContent>
                    <Tabs value={tab} onChange={handleTabChange} indicatorColor="secondary" variant="scrollable" scrollButtons="auto">
                        {
                            credentialSchemas.map((schema, index) => (
                                <Tab key={index} label={schema.name} />
                            ))
                        }
                    </Tabs>
                    <TabPanel>

                        {credentialSchema && records && records.length > 0 &&
                            <MockUserDataTable identity={identity} schema={credentialSchema} records={records} setShowMock={setShowMock} setStatus={setStatus} />
                        }
                    </TabPanel>

                </CardContent>
            }
        </Card>
    )
}
