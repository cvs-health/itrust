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
/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, CardHeader, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import { Reply } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import TabPanel from "../../components/TabPanel";
import CredentialSchemaByTypeList from './CredentialSchemaByTypeList';
import { findCredentialTypes } from '../../services/CodelistService';
import { findCredentialSchemas } from '../../services/CredentialSchemaService';
import { findTenantAllowedCredentials, findTenants } from '../../services/TenantService';
import CredentialSchemaByIssuerList from './CredentialSchemaByIssuerList';


export default function ServiceCatalog() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const navigate = useNavigate();


  // Constants 
  const FILTER_BY_ISSUER = "issuer"
  const FILTER_BY_TYPE = "type"

  const [issuers, setIssuers] = useState([]);
  const [credentialTypeMap, setCredentialTypeMap] = useState(new Map());

  const [filterBy, setFilterBy] = useState(FILTER_BY_TYPE);
  const [tab, setTab] = useState(0);



  useEffect(() => {
    getCredentialSchemasByType();
    getCredentialSchemasByIssuers()

  }, []);

   const getCredentialSchemasByType = async() => {
    setLoading(true);
    const types = await findCredentialTypes()
    const schemas = await findCredentialSchemas();
    // Add to a list of promises and wait till both complete 
    const results = await Promise.all([types, schemas]);
    filterCredentialSchema(filterBy, results[0], results[1]);
    setLoading(false);
  }

  
  const getCredentialSchemasByIssuers = async() => {
    setLoading(true);
    const issuers = await findTenants();
    // For each issuer, get the allowed credentials. Add the promises to a list and wait till all complete

    const promises = issuers.map(async (issuer) => {
      const allowedCredentials = await findTenantAllowedCredentials(issuer.ID);
      issuer.allowedCredentials = allowedCredentials;
      return issuer;
    })
    await Promise.all(promises);
    setIssuers(issuers);
    console.log ('Issuers: ', issuers)
    setLoading(false);
  }
  
  const handleTabChange = (event, index) => {
    setTab(index);
  };



  const filterCredentialSchema = async (filterBy, types, schemas) => {
    if (filterBy === FILTER_BY_TYPE) {
      let credentialTypeMap = new Map();
      types.forEach(type => {
        let t = {
          typeId: type.ID,
          name: type.name,
          description: type.description
        }
        credentialTypeMap.set(JSON.stringify(t), []);
      });

      schemas.forEach(schema => {
        schema.credentialTypes.forEach(type => {
          let s = {
            schemaId: schema.ID,
            name: schema.name,
            version: schema.version,
            description: schema.description
          }
          let key = {
            typeId: type.ID,
            name: type.name,
            description: type.description
          }
          credentialTypeMap.get(JSON.stringify(key)).push(s);
        });
      })
      setCredentialTypeMap(credentialTypeMap);
    } else if (filterBy === FILTER_BY_ISSUER) {
    }
  }



  const handleBack = () => {
    navigate(-1);
  };

  return loading ? (
    <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
      <GridLoader color="purple" />
    </Box>
  ) : (
    <Box display="flex" flexDirection="column" gap={1}>
      <StatusMessage status={status} changeStatus={setStatus} />
      <Card elevation={0}>
        <CardHeader
          title="Credential Catalog"
          titleTypographyProps={{ color: "primary.main", variant: "title" }}
          subheader={
            <Box>
              <Typography>View available credentials you could request from issuers in the iTrust ecosystem</Typography>
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
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Tabs value={tab} onChange={handleTabChange} indicatorColor="secondary">
              <Tab label="By Type" />
              <Tab label="By Issuer" />
            </Tabs>
          </Stack>
          <TabPanel>
            {tab === 0 && credentialTypeMap && 
              <CredentialSchemaByTypeList credentialTypeMap={credentialTypeMap} />
            }
            {tab === 1 && (
              <CredentialSchemaByIssuerList issuers={issuers} />
            )}
          </TabPanel>
        </CardContent>

      </Card>

    </Box>
  )
}
