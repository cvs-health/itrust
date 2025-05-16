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

import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Fingerprint, Send } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { issueCredential } from '../../services/DigitalAddressService';
import { useAuthContext } from '../../context/AuthContext';
import { findDASByIdentifier } from '../../services/DASService';
import { DAS_IDENTIFIER, DATETIME_FORMAT } from '../../constants';
import { format, parseISO } from 'date-fns';

export default function MockUserDataTable({ identity, schema, records, setShowMock, setStatus, setSelectedRecord }) {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [issuer, setIssuer] = useState();


    useEffect(() => {
        async function getIssuer() {
            if (user.dasId){
                setIssuer( user?.das)
            }
            if (user.tenantId){
                setIssuer(user?.tenant)
            }
            if(user.dasId === null && user.tenantId === null) {
                const d = await findDASByIdentifier(DAS_IDENTIFIER);
                setIssuer(d)
            }
        }
        getIssuer();
    }, [schema, records]);

    const handleIssueCredential = async(record) => {

        // Make a copy of the record 
        const copy = { ...record }
        // Remove a few attributes (ID, CreatedAt, DeletedAt) from the record before issuing the credential
        const removeAttributes = ['ID', 'CreatedAt', 'UpdatedAt', 'DeletedAt']
        removeAttributes.forEach(attr => delete copy[attr])
        console.log ('Issuer: ', issuer)
        const payload = {
            metadata: {
                schema: schema.code,
                schemaVersion: schema.version,
                issuedTo: identity.firstName + " " + identity.lastName,
                issuedBy: issuer?.organization.name,
                issuerDigitalAddress : issuer?.organization.digitalAddress,
                issuerDID : issuer?.organization.did,
            },
            attributes: {
                ...copy
            }
        }
        // Issue the credential
        const credentialMetadata = await issueCredential(identity.did, payload);
        // console.log ("Credential Metadata: ", credentialMetadata)
        if (credentialMetadata){
            if(setSelectedRecord)
                setSelectedRecord(credentialMetadata)
            setStatus({ open: true, type: "success", message: "Credential issued successfully" });
        }

    }

    const handleCreateDigitalAddress = () => {
        setShowMock(false)
        navigate(`/identities/${identity?.ID}`, { state: {refresh: Math.random() } });
    }

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            {records && records?.map((item, index) => (
                <Box key={index} display="flex" flexDirection="row" boxShadow={4} p={1} >

                    {[...Array(3).keys()].map(key => (
                        <Box key={key} display="flex" flexDirection="column" width="25%">
                            {
                                /* For each loop, sort schema attributes by order, take a slice that is 1/3 of the schema attributes  */
                                schema.attributes
                                    .sort((a, b) => a.order - b.order)
                                    .slice(key * Math.ceil(schema.attributes.length / 3), (key + 1) * Math.ceil(schema.attributes.length / 3)).map((attr, index) => (
                                        <Box key={index}>
                                            <Typography variant="body1" fontWeight={"bold"}>
                                                {attr?.displayName}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                {/* {item[attr?.name] || 'N.A'} */}
                                                {attr?.Datatype === 'Date' && item[attr?.name]
                                                    ? format(parseISO(item[attr?.name]), DATETIME_FORMAT)
                                                    : item[attr?.name] || 'N.A'}
                                            
                                            
                                            </Typography>
                                        </Box>
                                    ))
                            }
                        </Box>

                    ))}


                    <Box display="flex" flexDirection="column" width="25%" alignItems="center" justifyContent="center">
                        <Button variant="contained" sx={{ width: '10em', height: '6em', fontSize: '1em' }} startIcon={<Send />} color="primary" onClick={() => handleIssueCredential(item)} disabled={identity?.did ? false : true}>
                            Issue Credential
                        </Button>
                        {!identity?.did && (
                            <>
                                {/* <Typography variant="body1" color="warning.main" mt={1}>
                                    No Digital Address
                                </Typography> */}
                                <Button variant="outlined" sx={{ width: '10em', height: '6em', fontSize: '1em', mt:1 }} startIcon={<Fingerprint />} onClick = {handleCreateDigitalAddress} color="primary">
                                    Create Digital Address
                                </Button>
                            </>
                        )
                        }
                    </Box>

                </Box>
            ))
            }
        </Box>
    )
}
