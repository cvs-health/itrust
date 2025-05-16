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

import { Box, Typography } from '@mui/material'
import { set } from 'date-fns'
import React, { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { GridLoader } from 'react-spinners'

export default function DigitalAddressPanel({ identity, loading }) {
    const [qrData, setQrData] = useState({})
    useEffect(() => {
        // make a copy of the identity object, except the data property 
        const cp = {...identity}
        cp["data"] = null
        setQrData(cp)

    }, [identity]);

    return loading ? (
        <Box boxShadow={4} p={4} display="flex" flexDirection="column"  justifyContent="flex-start" alignItems="center" width="90%">
            <Typography variant="subtitle1" mb={4}>
                Getting Digital Address...
            </Typography>
            <GridLoader color="#cc0404" />
        </Box>
    ) : (
        <Box boxShadow={4} p={4} display="flex" flexDirection="row" justifyContent="center" alignItems="center" gap={4} width="90%">
            <Box>
                <QRCode value={JSON.stringify(qrData)} size={128} />
            </Box>
            <Box>
                <Typography variant="body1" fontWeight={"bold"}>
                    Digital Address
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.digitalAddress}
                </Typography>
                <Typography variant="body1" fontWeight={"bold"} pt={2}>
                    DID
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.did}
                </Typography>
            </Box>
        </Box>

    )
}
