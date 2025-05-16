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

import { Box, Button, Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GridLoader } from "react-spinners";
import { Reply } from "@mui/icons-material";
import StatusMessage from "../../components/StatusMessage";
import { searchDigitalAddressByIssuer } from "../../services/DigitalAddressService";
import DigitalAddressTable from "./DigitalAddressTable";
import { useAuthContext } from "../../context/AuthContext";

export default function DigitalAddressList() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const [digitalAddresses, setDigitalAddresses] = useState([]);
    const { state } = useLocation();
    const { refresh } = { ...state };
    const {user} = useAuthContext();

    useEffect(() => {
        async function getDigitalAddresses() {
            setLoading(true);
            let issuerDid = user?.dasId ? user?.das?.organization.did: user?.tenant?.organization.did
            const results = await searchDigitalAddressByIssuer(issuerDid);
            // console.log('results', results)
            setDigitalAddresses(results);
            setLoading(false);
        }

        getDigitalAddresses();
    }, [user, refresh]);

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
            <Card>
                <CardHeader
                    title="Digital Addresses Created"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>
                                Digital Addresses created by your organization
                            </Typography>
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
                <CardContent>{digitalAddresses && <DigitalAddressTable digitalAddresses={digitalAddresses}/>}</CardContent>
            </Card>
        </Box>
    );
}
