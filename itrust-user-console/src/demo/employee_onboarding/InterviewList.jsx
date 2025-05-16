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
 import { Box, Button, Card, CardContent, CardHeader, Divider, Drawer, Typography } from "@mui/material";
 import React, { useEffect, useState } from "react";
 import { useLocation, useNavigate } from "react-router-dom";

 import InterviewTable from "./InterviewTable";
 import { GridLoader } from "react-spinners";
 import { Reply } from "@mui/icons-material";
 import StatusMessage from "../../components/StatusMessage";
 import { useAuthContext } from "../../context/AuthContext";
 import WorkdayNavbar from "./WorkdayNavbar";
 
 export default function InterviewList() {
     const navigate = useNavigate();
     const [loading, setLoading] = useState(false);
     const [status, setStatus] = useState({
         open: false,
         type: "success",
         message: "",
     });
     const [identities, setIdentities] = useState([]);
     const { user } = useAuthContext();
     const [showMock, setShowMock] = useState(false);
     const { state } = useLocation();
     const { refresh } = { ...state };
 
 
     useEffect(() => {
         async function getMockIdentities() {
             setLoading(true);
             
             setLoading(false);
         }
 
 
         getMockIdentities();
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
             <WorkdayNavbar />
             <StatusMessage status={status} changeStatus={setStatus} />
             <Card>
                 <CardHeader
                     title="Workday - Interview List as viewed by CVS Human Resources"
                     titleTypographyProps={{ color: "info.main", variant: "title" }}
                     subheader={
                         <Box>
                             <Typography fontWeight="bold" gutterBottom>
                                 <strong>Note</strong>:
                                 This screen is designed exclusively for demonstration purposes to showcase how Workday can seamlessly integrate with key features 
                                 of the iTrust Platform. It illustrates potential interaction points between Workday and iTrust's identity management and credential services.
                                 Please note that the buttons on this screen represent API invocations to simulate various actions, such as retrieving or updating data. These invocations demonstrate how Workday's systems can securely interact with iTrust's decentralized identity and credential verification capabilities.
                             </Typography>
                             <Typography color="black" fontWeight="bold" gutterBottom mt={2}>
                                 The actions shown here are for illustration only and are meant to demonstrate how iTrust services could be implemented with Workday. It is intended to give an overview of functionality, with no claims of being a fully developed or production-ready integration. 
                             </Typography>
                             <Typography fontWeight="bold" gutterBottom mt={2}>
                                 Important: This demo is NOT connected to live data or production environments. 
 
                             </Typography>
 
                         </Box>
                     }
                     subheaderTypographyProps={{ color: "warning.main", variant: "body1", fontWeight: "bold" }}
                     action={
                         <>
                             <Button startIcon={<Reply />} onClick={handleBack} color="warning">
                                 Back
                             </Button>
                         </>
                     }
                 />
                 <Divider />
 
                 <Divider />
                 <CardContent>{identities &&
                        <InterviewTable identities={identities} setShowMock={setShowMock} />
                    }
                 </CardContent>
             </Card>
 
             <Drawer variant="temporary" anchor="right" open={showMock} onClose={() => setShowMock(false)}>
                 <Box width="30vw" mt={8}>
                     {/* <MockPersonForm setShowMock={setShowMock} setStatus={setStatus} /> */}
                 </Box>
             </Drawer>
 
         </Box>
     );
 }
 