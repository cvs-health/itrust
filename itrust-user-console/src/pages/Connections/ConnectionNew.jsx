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
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, FormControl, FormHelperText, InputLabel, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import { AddCircle, Person, Reply } from '@mui/icons-material';
import { handleFormChange } from '../../utils/FormUtils';
import { addConnection, resolveDid } from '../../services/DigitalAddressService';

export default function ConnectionNew() {
    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [partyRelationTypes, setPartyRelationTypes] = useState([]);
    const [resolvedDAs, setResolvedDAs] = useState([]);

    const [formData, setFormData] = useState({
        daOrDid: "",
        partyRelationType: "",
    });

    const [errors, setErrors] = useState({
        daOrDid: "",
        partyRelationType: "",
    });

    useEffect(() => {
        const getPartyRelationTypes = async () => {
            const statuses = ["Customer", "Employee", "Partner", "Family", "Friend", "Member", "Vendor", "Other"]
            setPartyRelationTypes(statuses);
        }
        //console.log ('User: ', user)
        getPartyRelationTypes();
    }, [user]);


    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (formData.daOrDid.trim() === "") {
            newErrors.daOrDid = "Either DID or Digital Address is required";
            isValid = false;
        } else {
            newErrors.daOrDid = "";
        }

        if (formData.partyRelationType.trim() === "") {
            newErrors.partyRelationType = "Relation is required";
            isValid = false;
        } else {
            newErrors.partyRelationType = "";
        }

        setErrors(newErrors);
        return isValid;

    }

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);
        try {
            if (validateForm()) {
                console.log('Form: ', formData)
                // Form is valid, submit or perform further actions
                const response = await resolveDid(formData.daOrDid ?? formData.did);
                setResolvedDAs(response);
                // console.log('Response: ', response)
                
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

    const handleAddConnection = async (did, entityType) => {
        // console.log ('Adding the connection: ', did, entityType, formData.partyRelationType)
        const relation = {
            fromPartyDID: user?.did,
            fromPartyType: "Person",
            toPartyDID: did,
            toPartyType: entityType,
            partyRelationType: formData.partyRelationType
        }
        console.log ('Save the relation: ', relation)
        await addConnection(relation)
        setStatus({
            open: true,
            type: "success",
            message: "Added connection",
        });
        navigate("/connections", { state: { refresh: Math.random() } });
    }

    /*
// Create a relationship between the person and organization
	partyRelation := domain.PartyRelation{
		FromPartyDID:      payload["email"].(string), // This will have to go to another field that identifies external identity
		FromPartyType:     domain.ET_PERSON,
		ToPartyID:         tenantId,
		ToPartyType:       domain.ET_ORGANIZATION,
		PartyRelationType: rel,
	}
	partyRelation, err = s.PartyRelationRepository.SaveOrUpdatePartyRelation(ctx, partyRelation)
	if err != nil {
		return errors.New("could not create PartyRelation")
	}
    */


    const handleBack = () => {
        navigate(-1);
    };

    return loading ? (
        <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
            <GridLoader color="purple" />
        </Box>
    ) : (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <Card elevation={0}>
                <CardHeader
                    title="Add Connection"
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>Add your relations. Invitations will be sent to them to accept your request.</Typography>
                        </Box>
                    }
                    action={
                            <Button startIcon={<Reply />} onClick={handleBack} color="warning">
                                Back
                            </Button>
                    }
                />
                <Divider />
            </Card>
            <Card>
                <CardContent>
                    <Box display="flex" flexDirection="row" gap={4}>

                        <Box display='flex' flexDirection='column' gap={2} flexGrow={1}>
                            <form>
                                <TextField
                                    name="daOrDid"
                                    label="Digital Address or DID"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={formData.daOrDid ?? ""}
                                    onChange={(e) => setFormData({ ...formData, daOrDid: e.target.value })}
                                    error={!!errors.daOrDid}
                                    helperText={errors.daOrDid}
                                />
                                <FormControl sx={{ marginTop: 2, width: "100%" }}>
                                    <InputLabel id="partyRelationType">Relation</InputLabel>
                                    <Select
                                        labelId="partyRelationType"
                                        name="partyRelationType"
                                        required
                                        fullWidth
                                        variant="standard"
                                        value={formData.partyRelationType ?? ""}
                                        onChange={(e) => handleFormChange(setFormData, e)}
                                    >
                                        <MenuItem value="" key="country">
                                            --select--
                                        </MenuItem>
                                        {partyRelationTypes?.map((c) => {
                                            return (
                                                <MenuItem value={c} key={c}>
                                                    {c}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                    {errors.partyRelationType &&
                                        <FormHelperText error>{errors.partyRelationType}</FormHelperText>
                                    }
                                </FormControl>
                                <Stack direction="row" justifyContent="center" alignItems="center" gap={1} mt={4}>
                                    <Button onClick={handleBack}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={handleSearch}>
                                        Search
                                    </Button>
                                </Stack>
                            </form>
                        </Box>

                        {resolvedDAs && resolvedDAs.length > 0 &&
                            <Box boxShadow={4} p={1} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start" gap={4} >
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Typography variant='headline'>Confirm your selection</Typography>
                                    <List dense>
                                        {resolvedDAs.map((metadata, index) => {
                                            return (
                                                <ListItem key={index}
                                                    secondaryAction={
                                                        <AddCircle color="secondary" onClick={()=> handleAddConnection(metadata?.entityDID, metadata?.entityType)}/>
                                                    }
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar> <Person /> </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={metadata?.party?.name} secondary={metadata?.party?.did} />
                                                </ListItem>
                                            )
                                        })}

                                    </List>
                                </Box>
                            </Box>
                        }


                    </Box>


                </CardContent>
            </Card>
        </Box>
    )
}
