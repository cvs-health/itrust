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
import { Box, Button, Card, CardContent, CardHeader, Checkbox, Divider, FormControlLabel, Typography } from '@mui/material';
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import { Business, List, Reply, Schema } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { findCredentialMetadata } from '../../services/DigitalAddressService';
import CredentialsList from './CredentialsList';
import IssuersList from './IssuersList';
import CredentialTypeList from './CredentialTypeList';
import { useAuthContext } from '../../context/AuthContext';


export default function MyCredentials() {

  // Constants 
  const NO_FILTER = "none"
  const FILTER_BY_ISSUER = "issuer"
  const FILTER_BY_TYPE = "type"

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const navigate = useNavigate();

  // Filter options 
  const [credentialMetadatas, setCredentialMetadatas] = useState([]);
  const [credentials, setCredentials] = useState([]);

  const [uniqueIssuers, setUniqueIssuers] = useState([]);
  const [uniqueCredentialSchemas, setUniqueCredentialSchemas] = useState([]);
  const [showRevoked, setShowRevoked] = useState(false);

  const [filterBy, setFilterBy] = useState(NO_FILTER);
  const [selectedTab, setSelectedTab] = useState(0);

  const { user } = useAuthContext();



  useEffect(() => {
    const fetchCredentialMetadata = async () => {
      setLoading(true);
      //console.log('User: ', user)
      const data = {
        entityDigitalAddress: user?.digitalAddress,
        entityDid: user?.did
      }

      const metadatas = await findCredentialMetadata(data);
      setCredentialMetadatas(metadatas);


      // Get a list of unique issuerDID from the metadatas
      if (metadatas) {
        let uniqueIssuers = [...new Set(metadatas.map((metadata) => metadata.issuerName))];
        uniqueIssuers = uniqueIssuers.sort();
        setUniqueIssuers(uniqueIssuers);
        // Get a list of unique credentialSchemaId from the metadatas
        let uniqueCredentialSchemas = [...new Set(metadatas.map((metadata) => metadata.credentialSchema.name))];
        uniqueCredentialSchemas = uniqueCredentialSchemas.sort();
        setUniqueCredentialSchemas(uniqueCredentialSchemas);
      }

      // Set the first tab as the default 
      filterCredentials(selectedTab);
      setLoading(false);

    }

    if (user) {
      fetchCredentialMetadata();
    }


  }, [user]);

  const handleNoFilter = () => {
    setFilterBy(NO_FILTER);
  }

  const handleFilterByIssuer = () => {
    setFilterBy(FILTER_BY_ISSUER);
  }

  const handleFilterByCredentialType = () => {
    setFilterBy(FILTER_BY_TYPE);
  }

  const handleShowRevoked = (checked) => {
    setShowRevoked(checked);
    filterCredentials(selectedTab, checked);
  }




  // Filter the credentials based on the selected criteria 
  const filterCredentials = (index, revoked = showRevoked) => {
    setSelectedTab(index);
    // console.log('Filter by: ', filterBy, ' Tab: ', index, ' Show Revoked: ', revoked)

    if (filterBy === FILTER_BY_TYPE) {
      const selectedCredentialType = uniqueCredentialSchemas[index];
      // Get all the credentials for the selected type 
      let list = []
      if (revoked) {
        list = credentialMetadatas?.filter((metadata) => metadata.credentialSchema.name === selectedCredentialType)
      } else {
        list = credentialMetadatas?.filter((metadata) => metadata.credentialSchema.name === selectedCredentialType)
        list = list.filter((metadata) => (!metadata.hasOwnProperty('revoked') || !metadata.revoked || metadata.revoked === undefined || metadata.revoked === null));
      }
      setCredentials(list);
    } else if (filterBy === FILTER_BY_ISSUER) {
      const selectedIssuer = uniqueIssuers[index];
      // Get all the credentials for the selected type 
      let list = []
      if (revoked) {
        list = credentialMetadatas?.filter((metadata) => metadata.issuerName === selectedIssuer)
      } else {
        list = credentialMetadatas?.filter((metadata) => metadata.issuerName === selectedIssuer)
        list = list.filter((metadata) => (!metadata.hasOwnProperty('revoked') || !metadata.revoked || metadata.revoked === undefined || metadata.revoked === null));
      }
      setCredentials(list);
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
          title="My Credentials"
          titleTypographyProps={{ color: "primary.main", variant: "title" }}
          subheader={
            <Box>
              <Typography>View all verifiable credentials in one place</Typography>
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
        {
          (credentialMetadatas === undefined || credentialMetadatas === null || credentialMetadatas.length === 0) && (
            <CardContent>
              <Typography variant="body1" color="error">You have not been issued any credentials. Navigate the list of issues to see if you can be issued any credential.</Typography>
            </CardContent>
          )
        }
        {(credentialMetadatas && credentialMetadatas.length > 0) && (
          <>
            <CardContent>
              <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" gap={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="showRevoked"
                      value={showRevoked}
                      onChange={(e) => handleShowRevoked(e.target.checked)}
                      color="primary"
                      checked={showRevoked}
                    />
                  }
                  label={<Typography variant="body1" fontSize={'0.8rem'}>View Revoked</Typography>}
                />
                <Button variant="outlined" startIcon={<List />} color="primary" onClick={handleNoFilter}>
                  All
                </Button>
                <Button variant="outlined" startIcon={<Schema />} color="primary" onClick={handleFilterByCredentialType}>
                  View By Credential Type
                </Button>
                <Button variant="outlined" startIcon={<Business />} color="primary" onClick={handleFilterByIssuer}>
                  View By Issuer
                </Button>

              </Box>
            </CardContent>
            <Divider />
            <CardContent>
              {filterBy === NO_FILTER && (
                <CredentialsList credentials={credentialMetadatas} />
              )}
              {filterBy !== NO_FILTER &&
                <Box display="flex" flexDirection="row" gap={2}>
                  <Box display="flex" flexDirection="column" gap={1} width="15%">

                    {filterBy === FILTER_BY_ISSUER && uniqueIssuers && (
                      <IssuersList issuers={uniqueIssuers} filterCredentials={filterCredentials} setSelectedTab={setSelectedTab} />
                    )}
                    {filterBy === FILTER_BY_TYPE && uniqueCredentialSchemas && (
                      <CredentialTypeList credentialTypes={uniqueCredentialSchemas} filterCredentials={filterCredentials} setSelectedTab={setSelectedTab} />
                    )}
                  </Box>
                  <Box display="flex" flexDirection="column" gap={1} width="85%">
                    <CredentialsList credentials={credentials} />
                  </Box>
                </Box>
              }
            </CardContent>
          </>

        )}


      </Card>
    </Box>
  )
}
