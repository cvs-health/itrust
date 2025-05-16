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
import React from "react";
import { Link } from "react-router-dom";
import logoImage from '../../assets/images/logo.png';

export default function RegisterInfo() {
    return (
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
            <Box display="flex" flexDirection="row" justifyContent="center" mx={1} my={1}>
                <Link to="https://www.cvs.com" target="_blank">
                    <img src={logoImage} alt="Logo" onClick={() => navigate("/")} style={{ height: 20, width: 150, marginBottom: 2 }} />
                </Link>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={8}>
                <Typography variant="h4" color="white">
                    Welcome to iTrust!
                </Typography>

                <Typography variant="h6" color="secondary">
                    Unlocking a world of possibilities.
                </Typography>
            </Box>

            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={10}>
                <Typography variant="subtitle" color="white">
                    © {new Date().getFullYear()} CVS Health Corporation, All rights reserved
                </Typography>
            </Box>
        </Box>
    );
}
