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

import { Box, Button, Card, CardContent, CardHeader, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import RegisterInfo from './RegisterInfo';
import DigitalAddressPanel from '../../components/DigitalAddressPanel';
import { useLocation } from 'react-router-dom';
import { id } from 'date-fns/locale';
import { resolveDid } from '../../services/DigitalAddressService';
import { set } from 'date-fns';

export default function ViewDigitalAddress() {
    const [loading, setLoading] = useState(false);
    // Status message 
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [did, setDid] = useState(params.get("did"));
    const [identity, setIdentity] = useState(null);

    useEffect(() => {
        async function getDigitalAddress() {
            setLoading(true);
            const list = await resolveDid(did);
            if (list && list.length > 0) {
                const id = {
                    digitalAddress: list[0].entityDigitalAddress,
                    did: list[0].entityDID,
                };
                setIdentity(id);
            }
            setLoading(false);
        }

        getDigitalAddress()

    }, []);

    const handleConnectToDA = () => {
        setStatus({ open: true, type: "success", message: `Sending connection request to ${identity?.digitalAddress} `});
    }

    const handleVerifyDA = () => {
        setStatus({ open: true, type: "success", message: `Sending verification request to ${identity?.digitalAddress} `});
    }


    return (
        <Box display="flex" height="100vh">
            <StatusMessage status={status} changeStatus={setStatus} />
            <Box display="flex" flexDirection="column" bgcolor={"#cc0404"} width="30%">
                <RegisterInfo />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" width="70%" bgcolor={"black"}>
                <Card elevation={0} sx={{ width: "100%" }}>
                    <CardHeader
                        title="Your Digital Address"
                        titleTypographyProps={{ color: "primary.main", variant: "title" }}

                        sx={{ textAlign: "center" }}
                    />
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                            <DigitalAddressPanel identity={identity} loading={loading} />
                            <Box display="flex" flexDirection="column" alignItems="center" gap={1} width="40%" >
                            <Button variant="contained" sx={{ width: '12em', height: '4em', fontSize: '1em'}} onClick={handleConnectToDA}>Connect</Button>
                            <Button variant="contained" sx={{ width: '12em', height: '4em', fontSize: '1em'}} onClick={handleVerifyDA}>Verify</Button>

                            </Box>

                        </Stack>

                    </CardContent>
                </Card>


            </Box>
        </Box>

    )
}
