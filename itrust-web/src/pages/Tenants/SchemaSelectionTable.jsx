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
import { Box, Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import { findCredentialSchemas } from '../../services/CredentialSchemaService';
import CredentialSchemaTable from '../Credentials/CredentialSchemaTable';
import CredentialSchemaSelectionTable from '../Credentials/CredentialSchemaSelectionTable';
import { saveAllowedCredential } from '../../services/TenantService';

export default function SchemaSelectionTable({ tenantId, allowedCredentials, setAllowedCredentials }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [credentialSchemas, setCredentialSchemas] = useState([]);
  const [allCredentialSchemas, setAllCredentialSchemas] = useState([]);



  useEffect(() => {
    async function getCredentialSchemas() {
      setLoading(true);
      const allCredentialSchemas = await findCredentialSchemas();
      setAllCredentialSchemas(allCredentialSchemas);

      console.log ('All Credential Schemas: ', allCredentialSchemas)
      console.log ('Allowed Credentials: ', allowedCredentials)

      // Filter out the credential schemas that are already allowed
      const filteredCredentialSchemas = allCredentialSchemas.filter((cs) => {
        return !allowedCredentials.some((ac) => ac.credentialSchema.ID === cs.ID);
      });
      console.log('Filtered Credential Schemas: ', filteredCredentialSchemas)
      setCredentialSchemas(filteredCredentialSchemas);
      setLoading(false);
    }

    getCredentialSchemas();
  }, []);

  const handleClose = async () => {
    navigate(`/tenants/${tenantId}`, { state: { refresh: Math.random(), showTab: 5 } });
  }

  // Add the allowed credentials to the tenant
  const addAllowedCredentials = async (selectedRows) => {
    if (selectedRows){
      const promises = selectedRows.map((row) => {
        const selectedCredentialSchema = allCredentialSchemas.find((cs) => cs.ID === row);
        console.log('Selected Credential Schema: ', selectedCredentialSchema)
        // Create a new allowed credential object
        const newAllowedCredential = {
          credentialType: {
            ID: selectedCredentialSchema.credentialTypes[0].ID
          },
          credentialSchema: {
            ID: selectedCredentialSchema.ID
          },
          assuranceLevel: "AL-2"
        }
        return saveAllowedCredential(tenantId, newAllowedCredential);
      })
      await Promise.all(promises);
    }
    
    handleClose();
  }

  return loading ? (
     <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
      <GridLoader color="#cc0404" />
      <Typography variant="subtitle" mt={4}>
        Getting Credential Schemas...
      </Typography>
    </Box>
  ) : (
    <Card elevation={0}>
      <CardHeader
        title="Available Credential Schemas"
        titleTypographyProps={{ color: "primary.main", variant: "title" }}
        subheader="Select the credential schema to issue credentials based on the selected schema."
        action={
          <Button startIcon={<Cancel />} color="warning" onClick={handleClose}>
            Close
          </Button>
        }
      />
      <CardContent>
        {credentialSchemas &&
          <CredentialSchemaSelectionTable tenantId={tenantId} credentialSchemas={credentialSchemas} addAllowedCredentials={addAllowedCredentials} />}

      </CardContent>
    </Card>
  )
}
