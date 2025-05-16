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
import { useLocation, useNavigate } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Stack,
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
import { saveTenant, updateTenant } from "../../services/TenantService";
import { addYears, formatISO, parseISO, startOfDay } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers";
import { findDASById } from "../../services/DASService";
import { Reply } from "@mui/icons-material";
import { useAuthContext } from "../../context/AuthContext";

const useStyles = makeStyles((theme) => ({
    instructions: {
        marginTop: 1,
        marginBottom: 1,
        paddingBottom: 2,
        fontStyle: "italic",
    },
}));

export default function TenantNew() {
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });

    const { state } = useLocation();
    const { tenant } = { ...state };

    const [formData, setFormData] = useState({
        tenantId: "",
        organizationId: "",
        primaryContactId: "",
        identifier: "",
        name: "",
        dba: "",
        taxId: "",
        dateOfIncorporation: formatISO(startOfDay(new Date())),
        stateOfIncorporation: "",
        countryOfIncorporation: "",
        addressLine1: "",
        city: "",
        state: "",
        zipcode: "",
        phone: "",
        website: "",
        das: {
            id: "",
        },
        primaryContact: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        },
        subscriptionStart: formatISO(startOfDay(new Date())),
        subscriptionEnd: formatISO(startOfDay(addYears(new Date(), 1))),
        businessRiskScore: 50,
        securityRiskScore: 40,
        overallRiskScore: 50,
        tier: {
            id: "",
            name: "",
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
        "A tenant in our service acts as a private and secure namespace dedicated solely to your company. It's where you can manage users, set policies, and configure settings unique to your organization, ensuring that your data and operations remain isolated and under your control.",
        "Set up the contact details for your organization. This will be used for all communication and billing purposes.",
        "Risk Assessment ensures the safety and security of your organization. We will ask you a few questions to understand your risk profile. ",
        "Set Limits and Subscription details for your tenant",
    ];
    const [activeStep, setActiveStep] = useState(0);
    const steps = ["Organization Details", "Contact Information", "Risk Assessment", "Complete"];

    const [das, setDas] = useState(null);
    const [countries, setCountries] = useState([]);
    const [tiers, setTiers] = useState([]);
    const { user }  = useAuthContext();

    useEffect(() => {
        async function getCountries() {
            const countries = await findCodelistByName("country");
            setCountries(countries);
        }
        async function getTiers() {
            const tiers = await findCodelistByName("tenant_tier");
            setTiers(tiers);
        }
        async function getDAS() {
            // Get the DAS Id from the user 
            const d = await findDASById(user?.dasId)
            //const d = await findDASByIdentifier(DAS_IDENTIFIER);
            
            setDas(d);
            // Append the DAS Id to the form Data
            setFormData((prevState) => ({
                ...prevState,
                das: {
                    id: d?.ID,
                },
            }));
        }

        // Get Reference data
        getDAS();
        getCountries();
        getTiers();

        // Set the form data
        if (tenant) {
            setFormData({
                tenantId: tenant.ID,
                organizationId: tenant.organization?.ID,
                primaryContactId: tenant.primaryContact?.ID,
                identifier: tenant.identifier,
                name: tenant.organization?.name ?? "",
                dba: tenant.organization?.dba ?? "",
                taxId: tenant.organization?.taxId ?? "",
                dateOfIncorporation: tenant.organization?.dateOfIncorporation ?? "",
                stateOfIncorporation: tenant.organization?.stateOfIncorporation ?? "",
                countryOfIncorporation: tenant.organization?.countryOfIncorporation ?? "",
                addressLine1: tenant.organization?.address?.addressLine1 ?? "",
                city: tenant.organization?.address?.city ?? "",
                state: tenant.organization?.address?.state?.ID ?? "",
                zipcode: tenant.organization?.address?.zipcode ?? "",
                phone: tenant.organization?.phone?.main ?? "",
                website: tenant.organization?.website ?? "",
                das: {
                    id: tenant.das?.ID ?? das?.ID,
                },
                primaryContact: {
                    firstName: tenant.primaryContact?.firstName ?? "",
                    lastName: tenant.primaryContact?.lastName ?? "",
                    email: tenant.primaryContact?.email ?? "",
                    phone: tenant.primaryContact?.phone?.work ?? "",
                },
                subscriptionStart: tenant.subscriptionStart ?? "",
                subscriptionEnd: tenant.subscriptionEnd ?? "",
                businessRiskScore: tenant.businessRiskScore ?? 0,
                securityRiskScore: tenant.securityRiskScore ?? 0,
                overallRiskScore: tenant.overallRiskScore ?? 0,
                tier: {
                    id: tenant.tier?.ID ?? "",
                },
            });
        }
    }, []);

    const handleChange = (e) => {
        // console.log("Event: ", e.target.name, e.target.value, e.target.type, e.target.checked);
        const { name, value, type, checked } = e.target;
        // For checkboxes
        if (type === "checkbox") {
            setFormData((prevState) => ({
                ...prevState,
                [name]: checked,
            }));
        } else if (type === "mousedown") {
            // for sliders
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
        navigate(-1);
    };

    const handleNext = async () => {
        //console.log ("Active Step: ", activeStep, "Form Data: ", formData)
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
                const tenant = transformData(formData);
                const response = tenant?.ID ? await updateTenant(tenant.ID, tenant) : await saveTenant(tenant);
                setStatus({
                    open: true,
                    type: "success",
                    message: "Updated organization details",
                });
            }
            setError(null);
            setIsPending(false);
            navigate(-1, { state: { refresh: Math.random() } });
        } catch (err) {
            console.log(err);
            setError(err);
            setIsPending(false);
        }
    };

    // Create the payload to post to API
    const transformData = (formData) => {
        // console.log("Original Form Data: ", formData);
        let tenant = {
            ID: formData.tenantId,
            identifier: formData.identifier,
            das: {
                ID: formData.das?.id,
            },
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
            subscriptionStart: formData.subscriptionStart,
            subscriptionEnd: formData.subscriptionEnd,
            businessRiskScore: formData.businessRiskScore,
            securityRiskScore: formData.securityRiskScore,
            overallRiskScore: formData.overallRiskScore,
            tier: {
                ID: formData.tier.id,
            },
        };
        tenant = removeEmptyJsonValues(tenant);
        return tenant;
    };

    const handleBackStep = () => {
        setActiveStep(activeStep - 1);
    };

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
            <Card elevation={0}>
                <CardHeader
                    title={ tenant ? `${tenant?.organization?.name} Details`: "Define new tenant"}
                    titleTypographyProps={{ color: "primary.main", variant: "title" }}
                    subheader={
                        <Box>
                            <Typography>{ tenant ? "View": "Create"} tenant and contact information</Typography>
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
            </Card>


            {/* Basic Information   */}
            <Card>
                {/* <CardHeader title="Let us set up your tenant" titleTypographyProps={{ color: "primary.main", variant: "headline" }} /> */}

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
                                                    label="Tenant Identifier"
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
                                                <DatePicker
                                                label="Date of Incorporation"
                                                value={parseISO(formData.dateOfIncorporation)}
                                                slotProps={{ textField: { variant: "standard" } }}
                                                onChange={(date) => {
                                                    handleChange({
                                                        target: {
                                                            name: "dateOfIncorporation",
                                                            value: formatISO(date),
                                                        },
                                                    });
                                                }}
                                            />
                                                {/* <TextField
                                                    name="dateOfIncorporation"
                                                    label="Date of Incorporation"
                                                    required
                                                    fullWidth
                                                    variant="standard"
                                                    value={formData.dateOfIncorporation ?? ""}
                                                    onChange={handleChange}
                                                    error={!!errors.dateOfIncorporation}
                                                    helperText={errors.dateOfIncorporation}
                                                /> */}
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
                                {activeStep === 2 && (
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} width="50%">
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                            <Typography variant="body1" width="40%">
                                                Business Risk Score
                                            </Typography>
                                            <Slider
                                                name="businessRiskScore"
                                                // defaultValue={50}
                                                value={formData.businessRiskScore ?? 0}
                                                aria-label="Default"
                                                valueLabelDisplay="auto"
                                                step={10}
                                                marks
                                                min={10}
                                                max={100} 
                                                onChange={handleChange}
                                            />
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                            <Typography variant="body1" width="40%">
                                                Security Risk Score
                                            </Typography>
                                            <Slider
                                                name="securityRiskScore"
                                                // defaultValue={40}
                                                value={formData.securityRiskScore ?? 0}
                                                aria-label="Default"
                                                valueLabelDisplay="auto"
                                                step={10}
                                                marks
                                                min={10}
                                                max={100}
                                                onChange={handleChange}
                                            />
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                            <Typography variant="body1" width="40%">
                                                Overall Risk Score
                                            </Typography>
                                            <Slider
                                                name="overallRiskScore"
                                                // defaultValue={50}
                                                value={formData.overallRiskScore ?? 0}
                                                aria-label="Default"
                                                valueLabelDisplay="auto"
                                                step={10}
                                                marks
                                                min={10}
                                                max={100}
                                                onChange={handleChange}
                                            />
                                        </Stack>
                                    </Box>
                                )}
                                {activeStep === 3 && (
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} width="40%">
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                            <Typography variant="body1" width="40%">
                                                Subscription Tier
                                            </Typography>
                                            <FormControl sx={{ marginTop: 2, width: "100%" }}>
                                                <InputLabel id="tier">Tier</InputLabel>
                                                <Select
                                                    labelId="tier"
                                                    name="tier.id"
                                                    fullWidth
                                                    variant="standard"
                                                    value={formData.tier.id ?? ""}
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value="" key="tier">
                                                        --select--
                                                    </MenuItem>
                                                    {tiers?.map((t) => {
                                                        return (
                                                            <MenuItem value={t.ID} key={t.ID}>
                                                                {t.name}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                            <Typography variant="body1" width="40%">
                                                Subscription Start
                                            </Typography>
                                            <DatePicker
                                                label="From"
                                                value={parseISO(formData.subscriptionStart)}
                                                slotProps={{ textField: { variant: "standard" } }}
                                                onChange={(date) => {
                                                    handleChange({
                                                        target: {
                                                            name: "subscriptionStart",
                                                            value: formatISO(date),
                                                        },
                                                    });
                                                }}
                                            />
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                            <Typography variant="body1" width="40%">
                                                Subscription End
                                            </Typography>
                                            <DatePicker
                                                label="To"
                                                value={parseISO(formData.subscriptionEnd)}
                                                slotProps={{ textField: { variant: "standard" } }}
                                                onChange={(date) => {
                                                    handleChange({
                                                        target: {
                                                            name: "subscriptionEnd",
                                                            value: formatISO(date),
                                                        },
                                                    });
                                                }}
                                            />
                                        </Stack>
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
                    <Button variant="contained" color="primary" onClick={handleNext}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}
