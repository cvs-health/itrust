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

import { FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { findUniqueApplicationNames, findUniqueCompanies, findUniqueIdentityProviders, findUniqueIdentityTypes } from "../../services/MockDataService";
import { useAuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../services/UserService";

export default function IdentitySearchForm({ formData, setFormData, handleSubmit }) {

  const [companies, setCompanies] = React.useState(null);
  const [identityTypes, setIdentityTypes] = React.useState(null);
  const [identityProviders, setIdentityProviders] = React.useState(null);
  const [applicationNames, setApplicationNames] = React.useState(null);
  const { permissions } = useAuthContext();

  useEffect(() => {
    const getUniqueCompanies = async () => {
      try {
        const companies = await findUniqueCompanies();
        setCompanies(companies);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    const getUniqueIdentityTypes = async () => {
      try {
        const identityTypes = await findUniqueIdentityTypes();
        setIdentityTypes(identityTypes);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }

    const getUniqueIdentityProviders = async () => {
      try {
        const identityProviders = await findUniqueIdentityProviders();
        setIdentityProviders(identityProviders);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }

    const getUniqueApplicationNames = async () => {
      try {
        const applicationNames = await findUniqueApplicationNames();
        setApplicationNames(applicationNames);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }


    getUniqueCompanies();
    getUniqueIdentityTypes();
    getUniqueIdentityProviders();
    getUniqueApplicationNames();

  }, []);

  const handleChange = async (e) => {
    // console.log("Event: ", e.target.name, e.target.value, e.target.type, e.target.checked);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    const criteria = {
      ...formData,
      [e.target.name]: e.target.value,
    }
    handleSubmit(criteria);

  };

  return (
    <form>
      <Stack display="flex" direction="row" gap={8} justifyContent="flex-start" alignItems="center" mt={4}>
        {companies && hasPermission(permissions, "tenant.all") &&
          (<FormControl sx={{ width: "100%" }}>
          <InputLabel id="company">Filter By Company</InputLabel>
          <Select
            labelId="company"
            name="company"
            //fullWidth
            variant="standard"
            value={formData.company ?? ""}
            onChange={handleChange}
          >
            <MenuItem value="" key="company">
              --select--
            </MenuItem>
            {
              companies?.map((c) => {
                return (
                  <MenuItem value={c} key={c}>
                    {c}
                  </MenuItem>
                );
              })
            }

          </Select>
        </FormControl>)}
        {identityTypes && <FormControl sx={{ width: "100%" }}>
          <InputLabel id="identityType">Filter By Identity Type</InputLabel>
          <Select
            labelId="identityType"
            name="identityType"
            fullWidth
            variant="standard"
            value={formData.identityType ?? ""}
            onChange={handleChange}
          >
            <MenuItem value="" key="identityType">
              --select--
            </MenuItem>
            {
              identityTypes?.map((c) => {
                return (
                  <MenuItem value={c} key={c}>
                    {c}
                  </MenuItem>
                );
              })
            }

          </Select>
        </FormControl>}

        {identityProviders && <FormControl sx={{ width: "100%" }}>
          <InputLabel id="identityProvider">Filter By Identity Provider</InputLabel>
          <Select
            labelId="identityProvider"
            name="identityProvider"
            fullWidth
            variant="standard"
            value={formData.identityProvider ?? ""}
            onChange={handleChange}
          >
            <MenuItem value="" key="identityProvider">
              --select--
            </MenuItem>
            {
              identityProviders?.map((c) => {
                return (
                  <MenuItem value={c} key={c}>
                    {c}
                  </MenuItem>
                );
              })
            }
          </Select>
        </FormControl>}
        {applicationNames && <FormControl sx={{ width: "100%" }}>
          <InputLabel id="applicationName">Filter By Application</InputLabel>
          <Select
            labelId="applicationName"
            name="applicationName"
            fullWidth
            variant="standard"
            value={formData.applicationName ?? ""}
            onChange={handleChange}
          >
            <MenuItem value="" key="applicationName">
              --select--
            </MenuItem>
            {
              applicationNames?.map((c) => {
                return (
                  <MenuItem value={c} key={c}>
                    {c}
                  </MenuItem>
                );
              })
            }
          </Select>
        </FormControl>}
      </Stack>
    </form>
  );
}
