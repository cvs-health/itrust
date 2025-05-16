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

import { Apps, Assessment, BrandingWatermark, Business, Fingerprint, Home, Hub, Key, People, Public, BadgeOutlined, Upload, Verified,  } from "@mui/icons-material";
import React from "react";
import Dashboard from "./pages/Dashboard/Dashboard";
import MockIdentityList from "./pages/DataLake/MockIdentityList";
import ConnectorsList from "./pages/Connectors/ConnectorsList";
import UnderConstruction from "./pages/UnderConstruction";
import TenantList from "./pages/Tenants/TenantList";
import MyDAS from "./pages/Das/MyDAS";
import TenantNew from "./pages/Tenants/TenantNew";
import TenantDetail from "./pages/Tenants/TenantDetail";
import Register from "./pages/Onboarding/Register";
import { PERMISSIONS } from "./constants";
import MyTenant from "./pages/Tenants/MyTenant";
import UserDetail from "./pages/User/UserDetail";
import VerifyIssuerInfo from "./pages/Onboarding/VerifyIssuerInfo";
import VerifyBiometricInfo from "./pages/Onboarding/VerifyBiometricInfo";
import VerifyGovernmentIdentity from "./pages/Onboarding/VerifyGovernmentIdentity";
import CredentialSchemaList from "./pages/Credentials/CredentialSchemaList";
import CredentialSchemaNew from "./pages/Credentials/CredentialSchemaNew";
import CredentialSchemaDetail from "./pages/Credentials/CredentialSchemaDetail";
import ViewDigitalAddress from "./pages/Onboarding/ViewDigitalAddress";
import UserNew from "./pages/User/UserNew";
import AccessKeys from "./pages/Onboarding/AccessKeys";
import AccessKeyNew from "./pages/Onboarding/AccessKeyNew";
import ImportIdentities from "./pages/DataLake/ImportIdentities";
import APIDocumentation from "./components/APIDocumentation";
import DigitalAddressList from "./pages/DigitalAddress/DigitalAddressList";
import CredentialMetadataList from "./pages/Credentials/CredentialMetadataList";
import CandidateList from "./demo/employee_onboarding/CandidateList";
import MockWorkdayRecruiting from "./demo/employee_onboarding/MockWorkdayRecruiting";
// import CandidateList from "./demo/employee_onboarding/CandidateList";

export const routePaths = [
    {
        path: "/",
        name: "Home",
        type: "link",
        icon: Home,
        permission: PERMISSIONS.DASHBOARD_VIEW,
        component: <Dashboard />,
    },
    
    {
        path: "/tenants",
        name: "Tenants ",
        type: "link",
        icon: Business,
        permission: PERMISSIONS.TENANT_ALL,
        component: <TenantList />,
    },
    {
        path: "/identities",
        name: "Identities ",
        type: "link",
        icon: People,
        permission: PERMISSIONS.MOCK_ALL,
        component: <MockIdentityList />,
    },
    {
        path: "/credential_schema",
        name: "Credential Schema ",
        type: "link",
        icon: BadgeOutlined,
        permission: PERMISSIONS.VC_MANAGE,
        component: <CredentialSchemaList />,
    },
    {
        path: "/reports",
        name: "Reports",
        type: "submenu",
        icon: Assessment,
        permission: PERMISSIONS.REPORT_ALL,
        children: [
            {
                path: "/digital-address",
                name: "Digital Address Created",
                type: "link",
                icon: People,
                permission: Permissions.REPORT_ALL,
                component: <DigitalAddressList />,
            },
            {
                path: "/credentials",
                name: "Credentials Issued",
                type: "link",
                icon: BrandingWatermark,
                permission: Permissions.REPORT_ALL,
                component: <CredentialMetadataList />,
            },
        ]
        
    },
    {
        path: "/demo",
        name: "Demo",
        type: "submenu",
        icon: Apps,
        permission: PERMISSIONS.REPORT_ALL,
        children: [
            {
                path: "/mock-workday",
                name: "Workday - New Hire Recruiting",
                type: "link",
                icon: People,
                permission: Permissions.REPORT_ALL,
                component: <MockWorkdayRecruiting />,
            },
            {
                path: "/candidates",
                name: "Mock - Candidates List",
                type: "link",
                icon: People,
                permission: Permissions.REPORT_ALL,
                component: <CandidateList />,
            },
        ]
        
    },
    {
        path: "/integrations",
        name: "Integrations",
        type: "submenu",
        icon: Hub,
        permission: 'integrations.manage',
        children: [
            {
                path: "/connectors",
                name: "Connectors",
                type: "link",
                icon: People,
                permission: 'integrations.manage',
                component: <ConnectorsList />,
            },
            {
                path: "/identities",
                name: "External Identities",
                type: "link",
                icon: People,
                permission: 'integrations.manage',
                component: <MockIdentityList />,
            },
        ],
    },
    // {
    //     path: "/directory",
    //     name: "Directory",
    //     type: "submenu",
    //     icon: People,
    //     permission: 'directory.manage',
    //     children: [
    //         {
    //             path: "/digital_address",
    //             name: "Digital Address",
    //             type: "link",
    //             icon: People,
    //             permission: 'da.manage',
    //             component: <UnderConstruction />,
    //         },
    //         {
    //             path: "/credentials",
    //             name: "Credentials",
    //             type: "link",
    //             icon: People,
    //             permission: 'credentials.manage',
    //             component: <UnderConstruction />,
    //         },
            
    //     ],
    // },
    // DAS Routes
    {
        path: "/das/my_das",
        name: "My DAS",
        type: "custom",
        icon: Public,
        permission: PERMISSIONS.DAS_VIEW,
        component: <MyDAS />,
    },
    {
        path: "/tenants/my_tenant",
        name: "My Tenant",
        type: "custom",
        icon: Public,
        permission: PERMISSIONS.TENANT_VIEW,
        component: <MyTenant />,
    },
    {
        path: "/tenants/access_keys",
        name: "Access Keys",
        type: "custom",
        icon: Key,
        permission: PERMISSIONS.TENANT_VIEW,
        component: <AccessKeys />,
    },
    {
        path: "/api-docs",
        name: "API Documentation",
        type: "custom",
        icon: Key,
        permission: PERMISSIONS.DASHBOARD_VIEW,
        component: <APIDocumentation />,
    },

    // Tenant Routes
    {
        path: "/tenants/new",
        name: "New Tenant",
        type: "custom",
        icon: Business,
        permission: PERMISSIONS.TENANT_CREATE,
        component: <TenantNew />,
    },
    {
        path: "/tenants/:id",
        name: "View Tenant",
        type: "custom",
        icon: Business,
        permission: PERMISSIONS.TENANT_VIEW,
        component: <TenantDetail />,
    },
    {
        path: "/tenants/edit/:id",
        name: "Edit Tenant",
        type: "custom",
        icon: Business,
        permission: PERMISSIONS.TENANT_UPDATE,
        component: <TenantNew />,
    },
    {
        path: "/tenants/access_keys/new",
        name: "New Access Key",
        type: "custom",
        icon: Key,
        permission: PERMISSIONS.TENANT_MANAGE,
        component: <AccessKeyNew />,
    },

    {
        path: "/register",
        name: "Register",
        type: "custom",
        icon: Business,
        permission: PERMISSIONS.ACCOUNT_REGISTER,
        component: <Register />,
    },

    {
        path: "/identities/:id",
        name: "View User",
        type: "custom",
        icon: People,
        permission: PERMISSIONS.USER_VIEW,
        component: <UserDetail />,
    },
    {
        path: "/identities/edit/:id",
        name: "Edit External User",
        type: "custom",
        icon: People,
        permission: PERMISSIONS.USER_UPDATE,
        component: <UserNew />,
    },
    {
        path: "/identities/import",
        name: "Import from File",
        type: "custom",
        icon: Upload,
        permission: PERMISSIONS.USER_UPDATE,
        component: <ImportIdentities />,
    },

    {
        path: "/digital_address/view",
        name: "Verify Issuer Information",
        type: "custom",
        icon: Fingerprint,
        permission: PERMISSIONS.DA_VIEW,
        component: <ViewDigitalAddress />,
    },
    {
        path: "/digital_address/verify_issuer_info",
        name: "Verify Issuer Information",
        type: "custom",
        icon: Verified,
        permission: PERMISSIONS.ACCOUNT_REGISTER,
        component: <VerifyIssuerInfo />,
    },
    {
        path: "/digital_address/verify_biometric",
        name: "Verify With Biometric Information",
        type: "custom",
        icon: Verified,
        permission: PERMISSIONS.ACCOUNT_REGISTER,
        component: <VerifyBiometricInfo />,
    },
    {
        path: "/digital_address/verify_government_id",
        name: "Verify Government ID Information",
        type: "custom",
        icon: Verified,
        permission: PERMISSIONS.ACCOUNT_REGISTER,
        component: <VerifyGovernmentIdentity />,
    },
    
    {
        path: "/credential_schema/new",
        name: "New Credential Schema",
        type: "custom",
        icon: BadgeOutlined,
        permission: PERMISSIONS.VC_MANAGE,
        component: <CredentialSchemaNew />,
    },
    {
        path: "/credential_schema/:id",
        name: "View Credential Schema",
        type: "custom",
        icon: BadgeOutlined,
        permission: PERMISSIONS.VC_MANAGE,
        component: <CredentialSchemaDetail />,
    },
    {
        path: "/credential_schema/edit/:id",
        name: "Edit Credential Schema",
        type: "custom",
        icon: BadgeOutlined,
        permission: PERMISSIONS.VC_MANAGE,
        component: <CredentialSchemaNew />,
    },
    
];
