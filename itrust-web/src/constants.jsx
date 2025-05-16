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

// Formats 
export const DATE_FORMAT = import.meta.env.VITE_DATE_FORMAT || 'MM/dd/yyyy'
export const DATETIME_FORMAT = import.meta.env.VITE_DATETIME_FORMAT || 'MM/dd/yyyy HH:mm:ss'
export const API_GATEWAY = import.meta.env.VITE_API_GATEWAY
export const ITRUST_PROXY = import.meta.env.VITE_ITRUST_PROXY
export const USER_CONSOLE_URL = import.meta.env.VITE_USER_CONSOLE_URL
export const ROWS_PER_PAGE = parseInt(import.meta.env.VITE_ROWS_PER_PAGE) || 25

export const EXTERNAL_CALLBACK_API = import.meta.env.VITE_EXTERNAL_CALLBACK_API

export const STANDARD_DELAY = 1000

// Verification keys
export const VERIFICATION_CODE_LENGTH = 8
export const VERIFICATION_CODE_SPLIT = 4
export const VERIFICATION_CODE_ALPHANUMERIC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No confusing chars such as 'O' and 0 or I and 1. 
export const VERIFICATION_CODE_NUMERIC = '1234567890' // All numbers. 


// Keycloak 
export const KEYCLOAK_BASE_URL = import.meta.env.VITE_KEYCLOAK_BASE_URL
export const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM
export const KEYCLOAK_CLIENT = import.meta.env.VITE_KEYCLOAK_CLIENT
export const KEYCLOAK_TOKEN_EXPIRATION = import.meta.env.VITE_KEYCLOAK_TOKEN_EXPIRATION

// iTrust 
export const ITRUST_LOGIN_URL = import.meta.env.VITE_ITRUST_LOGIN_URL


// DAS Configuration 
export const DAS_IDENTIFIER = import.meta.env.VITE_DAS_IDENTIFIER || 'CVS'

// Invitation Types 
export const DAS_ADMIN_INVITE = "das.admin.invite";
export const TENANT_ADMIN_INVITE = "tenant.admin.invite";
export const USER_INVITE = "user.invite";

// Entity Types 
export const ET_PERSON = "Person"
export const ET_ORGANIZATION = "Organization"

// Process Constants 
export const UserRegistrationStart = "UserRegistrationStart"
export const UserRegistrationStarted = "UserRegistrationStarted"
export const DASRegistrationStart = "DASRegistrationStart"
export const DASRegistrationStarted = "DASRegistrationStarted"
export const TenantRegistrationStart = "TenantRegistrationStart"
export const TenantRegistrationStarted = "TenantRegistrationStarted"

export const DigitalAddressFound = "DigitalAddressFound"
export const DigitalAddressNotFound = "DigitalAddressNotFound"
export const WalletInitialized = "WalletInitialized"
export const DigitalAddressCreated = "DigitalAddressCreated"
export const GeneratedDIDDocument = "GeneratedDIDDocument"
export const IdentityCredentialIssued = "IdentityCredentialIssued"
export const DigitalAddressIDPRegistered = "DigitalAddressIDPRegistered"
export const NotificationSent = "NotificationSent" 

// Process constants
export const PROCESS_NOT_STARTED = "Not Started"
export const PROCESS_START       = "Start"
export const PROCESS_STARTING    = "Starting"
export const PROCESS_STARTED     = "Started"
export const PROCESS_STOP        = "Stop"
export const PROCESS_STOPPING    = "Stopping"
export const PROCESS_STOPPED     = "Stopped"
export const PROCESS_RESUME      = "Resume"
export const PROCESS_RESUMING    = "Resuming"
export const PROCESS_RESUMED     = "Resumed"
export const PROCESS_COMPLETE    = "Complete"
export const PROCESS_COMPLETING  = "Completing"
export const PROCESS_COMPLETED   = "Completed"
export const PROCESS_ABORT       = "Abort"
export const PROCESS_ABORTING    = "Aborting"
export const PROCESS_ABORTED     = "Aborted"
export const PROCESS_PENDING     = "Pending"

// Permissions 
export const PERMISSIONS = {
    DASHBOARD_VIEW: 'dashboard.view',
    DAS_ALL: 'das.all',
    TENANT_ALL: 'tenant.all',
    DAS_MANAGE: 'das.manage',
    DAS_CREATE: 'das.create',
    DAS_VIEW: 'das.view',
    DAS_UPDATE: 'das.update',
    DAS_DELETE: 'das.delete',
    TENANT_MANAGE: 'tenant.manage',
    TENANT_CREATE: 'tenant.create',
    TENANT_VIEW: 'tenant.view',
    TENANT_UPDATE: 'tenant.update',
    TENANT_DELETE: 'tenant.delete',
    USER_MANAGE: 'user.manage',
    USER_CREATE: 'user.create',
    USER_VIEW: 'user.view',
    USER_UPDATE: 'user.update',
    USER_DELETE: 'user.delete',
    ROLE_MANAGE: 'role.manage',
    ROLE_CREATE: 'role.create',
    ROLE_VIEW: 'role.view',
    ROLE_UPDATE: 'role.update',
    ROLE_DELETE: 'role.delete',
    PERMISSION_MANAGE: 'permission.manage',
    PERMISSION_CREATE: 'permission.create',
    PERMISSION_VIEW: 'permission.view',
    PERMISSION_UPDATE: 'permission.update',
    PERMISSION_DELETE: 'permission.delete',
    DA_CREATE: 'da.create',
    DA_VIEW: 'da.view',
    DA_UPDATE: 'da.update',
    DA_DELETE: 'da.delete',
    DA_REVOKE: 'da.revoke',
    VC_MANAGE: 'vc.manage',
    VC_ISSUE: 'vc.issue',
    VC_REVOKE: 'vc.revoke',
    VC_VERIFY: 'vc.verify',
    ACCOUNT_INVITE: 'account.invite',
    ACCOUNT_REGISTER: 'account.register',
    REPORT_ALL: 'report.all',
    AUDIT_ALL: 'audit.all',
    MOCK_ALL: 'mock.all',
}

// Credential Schema constants 


export const CREDENTIAL_SCHEMA_IDENTITY = "adia.schema.identity"
export const CREDENTIAL_SCHEMA_WORK = "adia.schema.work"
export const CREDENTIAL_SCHEMA_PATIENT_IDENTITY = "adia.schema.patient-identity"
export const CREDENTIAL_SCHEMA_EDUCATION = "adia.schema.education"
export const CREDENTIAL_SCHEMA_PROFESSIONAL_LICENSE = "adia.schema.professional-license"
export const CREDENTIAL_SCHEMA_ALLERGY = "adia.schema.allergy"
export const CREDENTIAL_SCHEMA_MEDICATION = "adia.schema.medication"
export const CREDENTIAL_SCHEMA_IMMUNIZATION = "adia.schema.immunization"
export const CREDENTIAL_SCHEMA_MEDICAL_CONDITION = "adia.schema.medical-condition"
export const CREDENTIAL_SCHEMA_MEDICAL_INSURANCE = "adia.schema.medical-insurance"
export const CREDENTIAL_SCHEMA_INTERVIEW = "adia.schema.interview"
export const CREDENTIAL_SCHEMA_TRAINING = "adia.schema.training"

// Private Id Configuration
export const PRIVATE_ID_URL = import.meta.env.VITE_PRIVATE_ID_URL
export const PRIVATE_ID_KEY= import.meta.env.VITE_PRIVATE_ID_KEY