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

import { DataGrid, GridActionsCellItem, GridRowModes, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { DataObject, DateRange, DoneAll, DoNotDisturb, Edit, Mail, Refresh, VerifiedUser } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Box, Button, Drawer, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusMessage from "../../components/StatusMessage";
import { ROWS_PER_PAGE, USER_INVITE } from "../../constants";
import { useAuthContext } from "../../context/AuthContext";
import { hasPermission, sendUserInvite } from "../../services/UserService";
import { findExternalIdentityById } from "../../services/MockDataService";
import MockInterviewSchedulePanel from "./MockInterviewSchedulePanel";
import MockTrainingPanel from "./MockTrainingPanel";
import { fireTrainingEvent } from "./CandidateService";

export default function CandidateTable({ identities }) {
    const navigate = useNavigate();
    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = useState([]);
    const { user, permissions } = useAuthContext();
    const [status, setStatus] = useState({
        open: false,
        type: "success",
        message: "",
    });
    const [showMockSchedule, setShowMockSchedule] = useState(false);
    const [identity, setIdentity] = useState({});

    useEffect(() => {
        setRows(identities);
    }, [identities]);

    const handleSendInvitation = async (id) => {
        const identity = identities.find((row) => row.ID === id);
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
        setStatus({ open: true, type: "success", message: `Enrollment request sent to ${identity?.firstName} ${identity?.lastName}` });
    }

    const handleSendTrainingInvitation = async (id) => {
        const identity = identities.find((row) => row.ID === id);
        const payload = {
            "eventType": "ApplicationEvent",
            "eventSubType": "NotificationEvent",
            "title": "Complete Training " + user?.tenant?.organization?.name,
            "data": {
                channel: "mail",
                subject: "Complete training " + user?.tenant?.organization?.name,
                to: `${identity?.firstName} ${identity?.lastName} <${identity?.email}>`,
                firstName: identity?.firstName,
                tenantName: user?.tenant?.organization?.name,
                template: "candidate.training",
            }
        }
        fireTrainingEvent(payload);
        setStatus({ open: true, type: "success", message: `Interview confirmation sent to ${identity?.firstName} ${identity?.lastName}` });
    }


    const handleScheduleInterview = async (id) => {
        const identity = identities.find((row) => row.ID === id);
        console.log('Identity: ', identity)
        setIdentity(identity);
        setShowMockSchedule(true)
    }




    const handleVerifyIdentity = async (id) => {
        const identity = identities.find((row) => row.ID === id);
        setStatus({ open: true, type: "success", message: `Verification request sent to ${identity?.firstName} ${identity?.lastName}` });
    }

    const columns = [
        {
            field: "firstName",
            headerName: "First Name",
            width: "100",
            editable: false,
        },
        {
            field: "lastName",
            headerName: "Last Name",
            width: "100",
            editable: false,
        },
        {
            field: "identityType",
            headerName: "Type",
            width: 100,
            editable: false,
        },
        {
            field: "register",
            headerName: "Register Identity",
            width: "150",
            editable: false,
            renderCell: (cell) => {
                return <Button variant="contained" startIcon={<Mail />} onClick={() => handleSendInvitation(cell.id)}>Registration Mail</Button>
            },
        },
        {
            field: "training",
            headerName: "Training Requirement",
            width: "150",
            editable: false,
            renderCell: (cell) => {
                return <Button variant="contained" startIcon={<Mail />} onClick={() => handleSendTrainingInvitation(cell.id)}>Training Mail</Button>
            },
        },
        {
            field: "pre-hire",
            headerName: "Schedule Interview",
            width: "150",
            editable: false,
            renderCell: (cell) => {
                return <Button variant="contained" startIcon={<DateRange />} onClick={() => handleScheduleInterview(cell.id)}>Schedule</Button>
            },
        },
        {
            field: "did",
            headerName: "Identity Verified?",
            width: "150",
            editable: false,
            renderCell: (cell) => {
                return cell.value ? <Button variant="text" startIcon={<DoneAll />} sx={{ color: 'blue', borderColor: 'blue', width: 120 }} >Verified</Button> :
                    <Button variant="text" startIcon={<DoNotDisturb />} sx={{ color: 'red', borderColor: 'red', width: 120 }} >Not Verified</Button>
            },
        },
        {
            field: "digitalAddress",
            headerName: "Digital Address",
            width: "200",
            editable: false,
            renderCell: (cell) => {
                return cell.value ? cell.value : 'N.A'
            },

        },
        {
            field: "post-hire",
            headerName: "Post-Hire Stage",
            width: "150",
            editable: false,
            renderCell: (cell) => {
                return <Button variant="contained"
                    startIcon={<VerifiedUser />}
                    onClick={() => handleVerifyIdentity(cell.id)}
                >Verify Identity</Button>
            },
        },

        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 200,
            cellClassName: "actions",

            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                return [
                    <GridActionsCellItem
                        icon={<Edit color="primary" />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditIdentity(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    const handleEditIdentity = (id) => async () => {
        console.log("clicked Edit", id);
        //setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
        // get the credentialSchema with id 
        const externalIdentity = await findExternalIdentityById(id);
        console.log('Found identity: ', externalIdentity)
        navigate(`/identities/edit/${id}`, { state: { identity: externalIdentity } });
    };



    // Returns a custom tool bar for the identity table
    function IdentityTableToolbar() {
        return (
            <GridToolbarContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <GridToolbarQuickFilter />
                <Box sx={{ marginRight: 8 }}>
                    <Button
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                    {hasPermission(permissions, "mock.all") && (<Button
                        startIcon={<DataObject color="warning" />}
                        onClick={setShowMockSchedule}

                    >
                        Mock Data
                    </Button>)
                    }

                </Box>
            </GridToolbarContainer>
        );
    }

    function NoRowsOverlay() {
        return (
            <Box display="flex" flexDirection="column" justifyContent={"center"} alignItems={"center"}>
                <Typography sx={{ padding: 2 }}>No identities found</Typography>
            </Box>
        );
    }



    const handleRefresh = () => {
        navigate("/identities", { state: { refresh: Math.random() } });
    }

    function getRowId(row) {
        return row.ID;
    }

    return (
        <div style={{ width: "100%" }}>
            <StatusMessage status={status} changeStatus={setStatus} />
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={getRowId}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: ROWS_PER_PAGE,
                        },
                    },
                }}
                pageSizeOptions={[ROWS_PER_PAGE, 50, 100]} // Allow users to change the page size
                checkboxSelection
                disableRowSelectionOnClick
                autoHeight
                slots={{
                    toolbar: IdentityTableToolbar,
                    noRowsOverlay: NoRowsOverlay,
                }}
                sx={{
                    border: 0,
                    boxShadow: 0,
                    fontSize: "1rem",
                    "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                    },
                    "& .MuiDataGrid-columnSeparator": {
                        display: "none",
                    },
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                }}
            />

            {/* Mock interview schedules */}
            <Drawer variant="temporary" anchor="right" open={showMockSchedule} onClose={() => setShowMockSchedule(false)}>
                <Box width="50vw" mt={15}>
                    {identity && <MockTrainingPanel identity={identity} setShowMockSchedule={setShowMockSchedule} setStatus={setStatus} />
                    }
                </Box>
            </Drawer>

            {/* Mock interview schedules */}
            <Drawer variant="temporary" anchor="right" open={showMockSchedule} onClose={() => setShowMockSchedule(false)}>
                <Box width="50vw" mt={15}>
                    {identity && <MockInterviewSchedulePanel identity={identity} setShowMockSchedule={setShowMockSchedule} setStatus={setStatus} />
                    }
                </Box>
            </Drawer>
        </div>
    );
}
