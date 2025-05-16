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

import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";
import { findTenantAllowedCredentials } from "../../services/TenantService";
import TenantAllowedCredentialsTable from "./TenantAllowedCredentialsTable";

export default function TenantPermissions({ tenantId }) {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const [allowedCredentials, setAllowedCredentials] = useState([]);


    useEffect(() => {

        async function getAllowedCredentials() {
            setLoading(true);

            const results = await findTenantAllowedCredentials(tenantId);
            setAllowedCredentials(results);
            setLoading(false);
        }

        if (tenantId) {
            getAllowedCredentials();
        }

    }, [tenantId]);

    return loading ? (
         <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="#cc0404" />
        </Box>
    ) : <TenantAllowedCredentialsTable tenantId={tenantId} allowedCredentials={allowedCredentials} setAllowedCredentials={setAllowedCredentials} />




}
