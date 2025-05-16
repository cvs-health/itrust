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
import { Link } from "react-router-dom";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { Fingerprint, Mail } from "@mui/icons-material";
import { USER_INVITE } from "../../constants";
import { useAuthContext } from "../../context/AuthContext";
import { sendUserInvite } from "../../services/UserService";
import DigitalAddressPanel from "../../components/DigitalAddressPanel";
import * as Constants from "../../constants"
import { createDigitalAddress } from "../../services/DigitalAddressService";

export default function UserGeneralDetail({ identity, setIdentity, setStatus }) {
    const [showDAPanel, setShowDAPanel] = useState(false);
    const [creatingDA, setCreatingDA] = useState(false);
    const { user } = useAuthContext();
    const [disableDA, setDisableDA] = useState(true);

    useEffect(() => {
        //console.log('User: ', user)
        if (identity?.digitalAddress) {
            setShowDAPanel(true);
        }

        // If user is a DAS Admin and DAS admin is initialized or user is tenant and tenant is initialied
        if ( (user?.dasId && user?.das?.organization?.did) || (user?.tenantId && user?.tenant?.organization?.did)) {
            setDisableDA(false);
        }

    }, [user]);

    const handleSendInvitation = async () => {
        const payload = {
            type: USER_INVITE,
            tenantId: user?.tenantId,
            email: identity?.email,
            phone: identity?.phone,
            data: {
                id: identity?.ID,
                firstName: identity?.firstName,
                lastName: identity?.lastName,
                identityType: identity?.identityType,
                accountId: identity?.accountId,
                externalId: identity?.id,
                email: identity?.email,
                phone: identity?.phone,
                street: identity?.street,
                city: identity?.city,
                state: identity?.state,
                zipcode: identity?.zipcode,
                country: identity?.country,
                dateOfBirth: identity?.dateOfBirth,
            }
        };
        // console.log("Payload: ", payload);
        await sendUserInvite(payload);
        setStatus({ open: true, type: "success", message: "Invitation sent" });
    }

    const handleCreateDigitalAddress = async () => {
        setCreatingDA(true);
        const payload = {
            "entityType": Constants.ET_PERSON,
            "firstName": identity?.firstName,
            "lastName": identity?.lastName,
            "dateOfBirth": identity?.dateOfBirth,
            "country": identity?.country,
            "callback": {
                "type": "REST",
                "url": Constants.EXTERNAL_CALLBACK_API + "/api/v1/mock/identities",
                "externalId": identity?.ID,
                "email": identity?.email,
                "phone": identity?.phone,
                "street": identity?.street,
                "city": identity?.city,
                "state": identity?.state,
                "zipcode": identity?.zipcode,
            },

        }
        const response = await createDigitalAddress(payload)
        identity.digitalAddress = response.entityDigitalAddress
        identity.did = response.entityDID
        setIdentity(identity);

        setShowDAPanel(true);
        setTimeout(() => {
            setCreatingDA(false);
        }, 1 * 1000);
    }

    return (
        <Box display="flex" flexDirection="row">
            <Box display="flex" flexDirection="column" width="25%">
                <Typography variant="body1" fontWeight={"bold"}>
                    First Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.firstName || "N.A."}
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                    Last Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.lastName || "N.A."}
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                    Address
                </Typography>
                <Typography variant="body1">
                    {identity?.street || "N.A."}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.city || ""} {identity?.state || ""} {identity?.zipcode || ""}
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                    Country
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.country || "N.A."}
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                    Email
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.email || "N.A."}
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                    Phone
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.phone || "N.A."}
                </Typography>

            </Box>

            <Box display="flex" flexDirection="column" width="25%">
                <Typography variant="body1" fontWeight={"bold"}>
                    Company
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.company || "N.A."}
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                    Identity Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.identityType || "N.A."}
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                    Application
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.applicationName || "N.A."}
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                    Account
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {identity?.accountId || "N.A."}
                </Typography>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="center" width="50%" gap={2}>
                {showDAPanel && identity && (
                    <DigitalAddressPanel identity={identity} loading={creatingDA} />
                )}
                {!showDAPanel && (
                    <>
                        <Typography variant="headline">
                            Create a Digital Address for {identity?.firstName} {identity?.lastName}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button startIcon={<Fingerprint />} variant="contained" sx={{ width: '16em', height: '8em', fontSize: '1em' }} onClick={handleCreateDigitalAddress} disabled={disableDA}>Create Digital Address</Button>
                            <Button startIcon={<Mail />} variant="contained" sx={{ width: '16em', height: '8em', fontSize: '1em' }} onClick={handleSendInvitation} disabled={disableDA}> Invite to Register</Button>
                        </Stack>
                        { disableDA && (
                            <Alert severity="error" sx={{ mb: 4 }}>
                                You must initialize your tenant before sending an invitation. To create Digital Address for your organization, please go to <Link to="/tenants/my_tenant">My Tenant</Link> under your profile.
                            </Alert>

                        )}
                    </>
                )}
            </Box>
        </Box>

    );
}
