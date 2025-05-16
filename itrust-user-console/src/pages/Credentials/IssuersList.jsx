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
import { Box, Tab, Tabs, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

export default function IssuersList({ issuers, filterCredentials }) {
    const [tab, setTab] = useState(0);

    useEffect(() => {
        filterCredentials(0);
    }, []);

    const handleTabChange = (event, index) => {
        setTab(index);
        filterCredentials(index);
    };
    return (
        <Box>
            <Typography variant='subtitle1'>Filter by Issuer</Typography>
            <Tabs value={tab} orientation='vertical' onChange={handleTabChange} indicatorColor="primary">
                {
                    issuers.map((issuer, index) => (
                        <Tab key={index} label={issuer} sx={{ alignItems: 'end', }} />
                    ))
                }
            </Tabs>
        </Box>
    )
}
