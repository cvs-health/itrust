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

import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { findCodelistByName } from '../../services/CodelistService';
import { findCredentialSchemaById, saveCredentialSchema, updateCredentialSchema } from '../../services/CredentialSchemaService';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import { Reply } from '@mui/icons-material';
import { handleFormChange } from '../../utils/FormUtils';

const useStyles = makeStyles((theme) => ({
  instructions: {
    marginTop: 1,
    marginBottom: 1,
    paddingBottom: 2,
    fontStyle: "italic",
  },
}));

export default function CredentialSchemaNew() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    version: "",
    description: "",
    status: "",
    credentialTypes: [],
    attributes: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    code: "",
    version: "",
  });
  const [credentialTypes, setCredentialTypes] = useState([]);
  const [credentialSchemaStatus, setCredentialSchemaStatus] = useState();
  const { state } = useLocation();
  const { credentialSchema } = { ...state };


  useEffect(() => {
    const getCredentialTypes = async () => {
      const credentialTypes = await findCodelistByName("credential_type");
      setCredentialTypes(credentialTypes);
    };
    const getCredentialSchemaStatus = async () => {
      const statuses = ["Draft", "Published", "Deprecated", "Deleted"]
      setCredentialSchemaStatus(statuses);
    }

    getCredentialTypes();
    getCredentialSchemaStatus();

    console.log('Credential Schema : ', credentialSchema)
    if (credentialSchema) {
      setFormData(credentialSchema);
    }

  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
      isValid = false;
    } else {
      newErrors.name = "";
    }
    if (formData.code.trim() === "") {
      newErrors.code = "Code is required";
      isValid = false;
    } else {
      newErrors.code = "";
    }
    if (formData.version.trim() === "") {
      newErrors.version = "Version is required";
      isValid = false;
    } else {
      newErrors.version = "";
    }


    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    try {
      if (validateForm()) {
        console.log('Form: ', formData)
        // Form is valid, submit or perform further actions
        // const tenant = transformData(formData);
        const response = credentialSchema?.ID ? await updateCredentialSchema(credentialSchema.ID, formData) : await saveCredentialSchema(formData);
        setStatus({
          open: true,
          type: "success",
          message: "Updated credential schema details",
        });
      }
      setError(null);
      setIsPending(false);
      //navigate(-1, { state: { refresh: Math.random() } });
    } catch (err) {
      console.log(err);
      setError(err);
      setIsPending(false);
    }
  }

  const handleBack = () => {
    navigate(-1);
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
          title={credentialSchema ? `${credentialSchema?.name} Details` : "Define new credential schema"}
          titleTypographyProps={{ color: "primary.main", variant: "title" }}
          subheader={
            <Box>
              <Typography>{credentialSchema ? "View" : "Create"} credential schema</Typography>
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
          <form>
            <Box display='flex' flexDirection='column' gap={2} width='48%'>
              <TextField
                name="name"
                label="Schema Name"
                required
                fullWidth
                variant="standard"
                value={formData.name ?? ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                name="code"
                label="Unique code for the schema"
                required
                fullWidth
                variant="standard"
                value={formData.code ?? ""}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                error={!!errors.code}
                helperText={errors.code}
              />
              <TextField
                name="version"
                label="Schema Version"
                required
                fullWidth
                variant="standard"
                value={formData.version ?? ""}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                error={!!errors.version}
                helperText={errors.version}
              />
              <TextField
                name="description"
                label="Description"
                required
                fullWidth
                variant="standard"
                value={formData.description ?? ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                error={!!errors.description}
                helperText={errors.description}
              />
              <FormControl sx={{ marginTop: 2, width: "100%" }}>
                <InputLabel id="credentialTypes">Credential Types</InputLabel>
                <Select
                  labelId="credentialTypes"
                  name="credentialTypes"
                  fullWidth
                  variant="standard"
                  multiple
                  //value={formData.credentialTypes?.map((c) => c.ID) ?? []}
                  value={formData.credentialTypes ?? []}
                  onChange={(e) => handleFormChange(setFormData, e)}
                >
                  <MenuItem value="" key="country">
                    --select--
                  </MenuItem>
                  {credentialTypes?.map((c) => {
                    return (
                      <MenuItem value={c} key={c.ID}>
                        {c.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl sx={{ marginTop: 2, width: "100%" }}>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  name="status"
                  fullWidth
                  variant="standard"
                  value={formData.status ?? ""}
                  onChange={(e) => handleFormChange(setFormData, e)}
                >
                  <MenuItem value="" key="country">
                    --select--
                  </MenuItem>
                  {credentialSchemaStatus?.map((c) => {
                    return (
                      <MenuItem value={c} key={c}>
                        {c}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                <Button onClick={handleBack}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Save
                </Button>
              </Stack>
            </Box>
          </form>

        </CardContent>

      </Card>
    </Box>

  )
}
