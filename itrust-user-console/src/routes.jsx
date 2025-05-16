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

import { AccountCircle, Apps, History, Segment, Home, Groups, People, BadgeOutlined } from "@mui/icons-material";
import React from "react";
import Dashboard from "./pages/Dashboard/Dashboard";
import MyCredentials from "./pages/Credentials/MyCredentials";
import UnderConstruction from "./pages/UnderConstruction"
import Profile from "./pages/User/Profile";
import ServiceCatalog from "./pages/Catalog/ServiceCatalog";
import MyConnections from "./pages/Connections/MyConnections";
import ConnectionNew from "./pages/Connections/ConnectionNew";
import ConnectionDetail from "./pages/Connections/ConnectionDetail";
import InterviewList from "./demo/employee_onboarding/InterviewList";
import CVSId from "./pages/User/CVSId";


export const routePaths = [
    {
        path: "/",
        name: "Home",
        type: "link",
        icon: Home,
        component: <Dashboard />,
    }, 
    {
        path: "/profile",
        name: "Profile",
        type: "custom",
        icon: AccountCircle,
        component: <Profile />,
    },
    {
        path: "/credentials",
        name: "Credentials",
        type: "link",
        icon: BadgeOutlined,
        component: <MyCredentials />,
    },
    {
        path: "/service_catalog",
        name: "Credential Catalog",
        type: "link",
        icon: Segment,
        component: <ServiceCatalog />,
    },
    {
        path: "/connections",
        name: "Connections",
        type: "link",
        icon: Groups,
        component: <MyConnections />,
    },
    {
        path: "/connections/new",
        name: "New Connection",
        type: "custom",
        icon: Groups,
        component: <ConnectionNew />,
    },
    {
        path: "/connections/:id",
        name: "View Connection",
        type: "custom",
        icon: Groups,
        component: <ConnectionDetail />,
    },

    {
        path: "/audit",
        name: "Audit History",
        type: "link",
        icon: History,
        component: <UnderConstruction />,
    },
    {
        path: "/demo",
        name: "Demo",
        type: "submenu",
        icon: Apps,
        children: [
            {
                path: "/cvs_id",
                name: "Associate CVS Id",
                type: "link",
                icon: People,
                component: <CVSId />,
            },
            {
                path: "/interviews",
                name: "My Interviews",
                type: "link",
                icon: People,
                component: <InterviewList />,
            },
        ]
        
    },

    
];
