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

import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from "@mui/material";
import { GridLoader } from "react-spinners";
import { makeStyles } from "@mui/styles";
import { findCodelistByName } from "../../services/CodelistService";
import AddressFormEdit from "../../components/AddressFormEdit";
import { removeEmptyJsonValues } from "../../utils/utils";
import { saveDAS, updateDAS } from "../../services/DASService";

const useStyles = makeStyles((theme) => ({
    instructions: {
        marginTop: 1,
        marginBottom: 1,
        paddingBottom: 2,
        fontStyle: "italic",
    },
}));

export default function DASNew({ das, setEditMode }) {
    const classes = useStyles();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const [formData, setFormData] = useState({
        dasId: "",
        organizationId: "",
        primaryContactId : "",
        identifier: "",
        name: "",
        dba: "",
        taxId: "",
        dateOfIncorporation: "",
        stateOfIncorporation: "",
        countryOfIncorporation: "",
        addressLine1: "",
        city: "",
        state: "",
        zipcode: "",
        phone: "",
        website: "",

        primaryContact: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        },
    });
    const [errors, setErrors] = useState({
        identifier: "",
        name: "",
        dateOfIncorporation: "",
        countryOfIncorporation: "",
        primaryContact: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        },
    });

    // Step functions
    const stepContent = [
        "Registering your organization name offers legal protection and establishes your exclusive right to use that name in your operating jurisdiction. Your organization details will be publicly available for others to discover.",
        "Set up the contact details for your organization. This will be used for all communication and billing purposes.",
        "That's it! You are done! There may be additional steps required to complete your registration. We will notify you if there are any additional steps required.",
    ];
    const [activeStep, setActiveStep] = useState(0);
    const steps = ["Organization Details", "Contact Information", "Complete"];

    const [countries, setCountries] = useState([]);
    useEffect(() => {
        async function getCountries() {
            const countries = await findCodelistByName("country");
            setCountries(countries);
        }
        // Fetch countries
        getCountries();

        // Set the form data
        if (das) {
            setFormData({
                dasId: das.ID,
                organizationId: das.organization?.ID,
                primaryContactId: das.primaryContact?.ID,
                identifier: das.identifier,
                name: das.organization?.name ?? "",
                dba: das.organization?.dba ?? "",
                taxId: das.organization?.taxId ?? "",
                dateOfIncorporation: das.organization?.dateOfIncorporation ?? "",
                stateOfIncorporation: das.organization?.stateOfIncorporation ?? "",
                countryOfIncorporation: das.organization?.countryOfIncorporation ?? "",
                addressLine1: das.organization?.address?.addressLine1 ?? "",
                city: das.organization?.address?.city ?? "",
                state: das.organization?.address?.state?.ID ?? "",
                zipcode: das.organization?.address?.zipcode ?? "",
                phone: das.organization?.phone?.main ?? "",
                website: das.organization?.website ?? "",
                primaryContact: {
                    firstName: das.primaryContact?.firstName ?? "",
                    lastName: das.primaryContact?.lastName ?? "",
                    email: das.primaryContact?.email ?? "",
                    phone: das.primaryContact?.phone?.work ?? "",
                },
            });

            //console.log ('State : ',das.organization?.address?.state )
        }
    }, []);

    const handleChange = (e) => {
        //console.log("Event: ", e.target.name, e.target.value, e.target.type, e.target.checked);
        const { name, value, type, checked } = e.target;
        // For checkboxes
        if (type === "checkbox") {
            setFormData((prevState) => ({
                ...prevState,
                [name]: checked,
            }));
        } else if (name.includes(".")) {
            const [parentKey, childKey] = name.split(".");
            setFormData((prevState) => ({
                ...prevState,
                [parentKey]: {
                    ...prevState[parentKey],
                    [childKey]: value,
                },
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleCancel = (e) => {
        Navigate(-1);
    };

    const handleNext = async () => {
        //console.log ('Active Step: ', activeStep, ' Form Data: ', formData);
        if (activeStep === 0) {
            setError(null);
            if (validateOrganizationForm()) {
                setError(null);
                setActiveStep(activeStep + 1);
            }
        } else if (activeStep === 1) {
            setError(null);
            if (validatePrimaryContactForm()) {
                setError(null);
                setActiveStep(activeStep + 1);
            }
        } else {
            setActiveStep(activeStep + 1);
        }

        // Last step - save the person
        if (activeStep === steps.length - 1) {
            await handleSubmit();
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        validateOrganizationForm(newErrors);
        validatePrimaryContactForm(newErrors);

        setErrors(newErrors);
        return isValid;
    };

    const validateOrganizationForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (formData.identifier.trim() === "") {
            newErrors.identifier = "Identifier is required";
            isValid = false;
        } else {
            newErrors.identifier = "";
        }

        // Validate name field
        if (formData.name.trim() === "") {
            newErrors.name = "Name is required";
            isValid = false;
        } else {
            newErrors.name = "";
        }

        // Validate date of incorporation
        if (formData.dateOfIncorporation.trim() === "") {
            newErrors.dateOfIncorporation = "Date of Incorporation is required";
            isValid = false;
        } else {
            newErrors.dateOfIncorporation = "";
        }

        // Validate country of incorporation
        if (formData.countryOfIncorporation.trim() === "") {
            newErrors.countryOfIncorporation = "Country of Incorporation is required";
            isValid = false;
        } else {
            newErrors.countryOfIncorporation = "";
        }

        setErrors(newErrors);
        return isValid;
    };

    const validatePrimaryContactForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        // Validate primary contact
        if (formData.primaryContact.firstName.trim() === "") {
            newErrors.primaryContact.firstName = "First Name is required";
            isValid = false;
        } else {
            newErrors.primaryContact.firstName = "";
        }
        if (formData.primaryContact.lastName.trim() === "") {
            newErrors.primaryContact.lastName = "Last Name is required";
            isValid = false;
        } else {
            newErrors.primaryContact.lastName = "";
        }
        if (formData.primaryContact.email.trim() === "") {
            newErrors.primaryContact.email = "Email is required";
            isValid = false;
        } else {
            newErrors.primaryContact.email = "";
        }
        if (formData.primaryContact.phone.trim() === "") {
            newErrors.primaryContact.phone = "Phone is required";
            isValid = false;
        } else {
            newErrors.primaryContact.phone = "";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        setIsPending(true);
        setError(null);

        try {
            if (validateForm()) {
                // Form is valid, submit or perform further actions

                const das = transformData(formData);
                // console.log("Transformed DAS: ", das);
                const response = das?.ID ? await updateDAS(das.ID, das) : await saveDAS(das);
                // console.log("Response: ", response);
                setStatus({
                    open: true,
                    type: "success",
                    message: "Updated organization details",
                });
            }
            setError(null);
            setIsPending(false);
            setEditMode(false);
            navigate("/das/my_das", { state: { refresh: Math.random() } });
        } catch (err) {
            console.log(err);
            setError(err);
            setIsPending(false);
        }
    };

    // Create the payload to post to API
    const transformData = (formData) => {
        let das = {
            ID: formData.dasId,
            identifier: formData.identifier,
            organization: {
                ID: formData.organizationId,
                name: formData.name,
                dba: formData.dba,
                taxId: formData.taxId,
                dateOfIncorporation: formData.dateOfIncorporation,
                stateOfIncorporation: formData.stateOfIncorporation?.code,
                countryOfIncorporation: formData.countryOfIncorporation,
                address: {
                    addressLine1: formData.addressLine1,
                    city: formData.city,
                    state: {
                        ID: formData.state
                    },
                    zipcode: formData.zipcode,
                },
                phone: {
                    main: formData.phone,
                },
                website: formData.website,
            },
            primaryContact: {
                ID: formData.primaryContactId,
                firstName: formData.primaryContact.firstName,
                lastName: formData.primaryContact.lastName,
                phone: {
                    work: formData.primaryContact.phone,
                },
                email: formData.primaryContact.email,
            },
        };
        das = removeEmptyJsonValues(das);
        return das;
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <StatusMessage status={status} changeStatus={setStatus} />

            {/* Basic Information   */}
            <Card>
                <CardHeader title="Lets set up your organization" titleTypographyProps={{ color: "primary.main", variant: "headline" }} />

                <CardContent>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box sx={{ marginTop: 4 }}>
                        {activeStep === steps.length ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "70vw",
                                    height: "70vh",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <GridLoader color="#cc0404" />
                            </Box>
                        ) : (
                            <>
                                <Typography className={classes.instructions}>{stepContent[activeStep]}</Typography>
                                {activeStep === 0 && (
                                    <form>
                                        <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
                                            <Box sx={{ display: "flex", flexDirection: "column" }} width={"48%"}>
                                                <TextField
                                                    name="name"
                                                    label="Name of your organization"
                                                    required
                                                    fullWidth
                                                    variant="standard"
                                                    value={formData.name ?? ""}
                                                    onChange={handleChange}
                                                    error={!!errors.name}
                                                    helperText={errors.name}
                                                />
                                                <TextField
                                                    name="identifier"
                                                    label="DAS Identifier"
                                                    required
                                                    fullWidth
                                                    variant="standard"
                                                    value={formData.identifier ?? ""}
                                                    onChange={handleChange}
                                                    error={!!errors.identifier}
                                                    helperText={errors.identifier}
                                                />
                                                <TextField
                                                    name="dba"
                                                    label="Doing Business As"
                                                    fullWidth
                                                    variant="standard"
                                                    value={formData.dba ?? ""}
                                                    onChange={handleChange}
                                                    error={!!errors.dba}
                                                    helperText={errors.dba}
                                                />
                                                <TextField
                                                    name="taxId"
                                                    label="Tax Identifier"
                                                    fullWidth
                                                    variant="standard"
                                                    value={formData.taxId ?? ""}
                                                    onChange={handleChange}
                                                    error={!!errors.taxId}
                                                    helperText={errors.taxId}
                                                />
                                                <TextField
                                                    name="dateOfIncorporation"
                                                    label="Date of Incorporation"
                                                    required
                                                    fullWidth
                                                    variant="standard"
                                                    value={formData.dateOfIncorporation ?? ""}
                                                    onChange={handleChange}
                                                    error={!!errors.dateOfIncorporation}
                                                    helperText={errors.dateOfIncorporation}
                                                    
                                                />
                                                <FormControl sx={{ marginTop: 2, width: "100%" }}>
                                                    <InputLabel id="countryOfIncorporation">Country Of Incorporation</InputLabel>
                                                    <Select
                                                        labelId="countryOfIncorporation"
                                                        name="countryOfIncorporation"
                                                        required
                                                        fullWidth
                                                        variant="standard"
                                                        value={formData.countryOfIncorporation ?? ""}
                                                        onChange={handleChange}
                                                    >
                                                        <MenuItem value="" key="country">
                                                            --select--
                                                        </MenuItem>
                                                        {countries?.map((c) => {
                                                            return (
                                                                <MenuItem value={c.code} key={c.code}>
                                                                    {c.name}
                                                                </MenuItem>
                                                            );
                                                        })}
                                                    </Select>
                                                    {errors.countryOfIncorporation && 
                                                        <FormHelperText error>{errors.countryOfIncorporation}</FormHelperText>
                                                    }
                                                </FormControl>
                                            </Box>
                                            <Box sx={{ display: "flex", flexDirection: "column" }} width={"48%"}>
                                                <AddressFormEdit formData={formData} handleChange={handleChange} isOrganization={true} />
                                            </Box>
                                        </Box>
                                    </form>
                                )}
                                {activeStep === 1 && (
                                    <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
                                        <Box sx={{ display: "flex", flexDirection: "column" }} width={"48%"}>
                                            <TextField
                                                name="primaryContact.firstName"
                                                label="First Name"
                                                required
                                                fullWidth
                                                variant="standard"
                                                value={formData.primaryContact.firstName ?? ""}
                                                onChange={handleChange}
                                                error={!!errors.primaryContact.firstName}
                                                helperText={errors.primaryContact.firstName}
                                            />
                                            <TextField
                                                name="primaryContact.lastName"
                                                label="Last Name"
                                                required
                                                fullWidth
                                                variant="standard"
                                                value={formData.primaryContact.lastName ?? ""}
                                                onChange={handleChange}
                                                error={!!errors.primaryContact.lastName}
                                                helperText={errors.primaryContact.lastName}
                                            />
                                            <TextField
                                                name="primaryContact.email"
                                                label="Email"
                                                required
                                                fullWidth
                                                variant="standard"
                                                value={formData.primaryContact.email ?? ""}
                                                onChange={handleChange}
                                                error={!!errors.primaryContact.email}
                                                helperText={errors.primaryContact.email}
                                            />
                                            <TextField
                                                name="primaryContact.phone"
                                                label="Phone"
                                                required
                                                fullWidth
                                                variant="standard"
                                                value={formData.primaryContact.phone ?? ""}
                                                onChange={handleChange}
                                                error={!!errors.primaryContact.phone}
                                                helperText={errors.primaryContact.phone}
                                            />
                                        </Box>
                                        <Box sx={{ display: "flex", flexDirection: "column" }} width={"48%"}></Box>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </CardContent>
                <CardActions
                    //disableSpacing
                    sx={{
                        alignSelf: "stretch",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-start",
                        paddingRight: 4,
                    }}
                >
                    <Button disabled={activeStep === 0} onClick={handleBack} >
                        Back
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleNext}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}
