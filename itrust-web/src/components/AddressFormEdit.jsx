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

import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { findCodelistByName } from "../services/CodelistService";

export default function AddressFormEdit({ formData, handleChange, isOrganization }) {
    // Codelist values
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);

    useEffect(() => {
        async function getCountries() {
            const countries = await findCodelistByName("country");
            setCountries(countries);
        }
        async function getStates() {
            const states = await findCodelistByName("state");
            setStates(states);
        }

        // Fetch countries
        getCountries();
        getStates();

        //console.log ('Form Data', formData);
    }, []);

    return (
        <>
            <TextField name="addressLine1" label="Street" fullWidth variant="standard" value={formData.addressLine1 ?? ""} onChange={handleChange} />
            <TextField name="city" label="City" fullWidth variant="standard" value={formData.city ?? ""} onChange={handleChange} />
            {states?.length>0 && <FormControl sx={{ marginTop: 2, width: "100%" }}>
                <InputLabel id="state">State</InputLabel>
                <Select labelId="state" name="state" fullWidth variant="standard" value={formData.state ?? ""} onChange={handleChange}>
                    <MenuItem value="0" key="state">
                        --select--
                    </MenuItem>
                    {states?.map((c) => {
                        return (
                            <MenuItem value={c?.ID} key={c?.ID}>
                                {c?.name}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>}

            <TextField name="zipcode" label="Zipcode" fullWidth variant="standard" value={formData.zipcode ?? ""} onChange={handleChange} />
            <TextField name="phone" label="Phone" fullWidth variant="standard" value={formData.phone ?? ""} onChange={handleChange} />
            {isOrganization && (
                <TextField name="website" label="Website" fullWidth variant="standard" value={formData.website ?? ""} onChange={handleChange} />
            )}
        </>
    );
}
