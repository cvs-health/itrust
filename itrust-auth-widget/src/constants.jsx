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
// DAS Configuration 
export const DAS_IDENTIFIER = import.meta.env.VITE_DAS_IDENTIFIER || 'CVS'

export const API_GATEWAY = import.meta.env.VITE_API_GATEWAY
export const USER_CONSOLE= import.meta.env.VITE_USER_CONSOLE
 
// Private Id Configuration
export const PROVIDER_PRIVATEID = "PrivateID"
export const PRIVATE_ID_URL = import.meta.env.VITE_PRIVATE_ID_URL
export const PRIVATE_ID_KEY= import.meta.env.VITE_PRIVATE_ID_KEY

// Operation
export const OPERATION_AUTHENTICATE = "auth"
export const OPERATION_REGISTER = "reg"
export const OPERATION_DELETE = "del"

export const STATE_START = "Start"
export const STATE_FACE_DETECTED = "Face detected";
export const STATE_FACE_NOT_DETECTED = "Face not detected";
export const STATE_AUTHENTICATED = "Authenticated";
export const STATE_AUTHENTICATION_FAILED = "Authentication Failed";
export const STATE_ENROLLED = "Enrolled";
export const STATE_USER_ALREADY_ENROLLED = "User Already Enrolled";
export const STATE_DIGITAL_ADDRESS = "Digital Address";
export const STATE_NO_DIGITAL_ADDRESS = "No Digital Address";
export const STATE_COMPLETE = "Complete";
export const STATE_DELETED = "Deleted";


// Panels for Auth Widget 
export const MAIN_PANEL = "MainPanel";
export const INITIALIZE_PANEL = "InitializePanel";
export const PANEL_FACE = "FacePanel";
export const PANEL_STATUS = "StatusPanel";
export const PANEL_COMPLETE = "CompletePanel";

export const STANDARD_DELAY = 1000
export const POLL_INTERVAL_1S = 1 * 1000 // Every second
export const POLL_INTERVAL_3S = POLL_INTERVAL_1S * 3 // Every 3 seconds
export const POLL_INTERVAL_10S = POLL_INTERVAL_1S * 10 // Every 10 seconds
export const POLL_INTERVAL_30S = POLL_INTERVAL_1S * 30 // Every 30 seconds
export const POLL_INTERVAL_60S = POLL_INTERVAL_1S * 60 // Every 60 seconds
export const MAX_WAIT_TIME = 5 * POLL_INTERVAL_60S // 5 minute
export const REGISTRATION_MAX_WAIT_TIME = 15 * POLL_INTERVAL_60S // 3 minute


// Websocket Events
export const CONNECTION_ID= "connectionId"
export const Handshake = "Handshake"
export const Error = "Error"
export const Ping = "Ping"
export const Pong = "Pong"
export const ReplayMessages = "ReplayMessages"

export const KeyExchange = "KeyExchange"
export const SIGN_PUBLIC_KEY        = "signPublicKey"
export const SIGN_PRIVATE_KEY       = "signPrivateKey"
export const ENCRYPTION_PUBLIC_KEY  = "encryptionPublicKey"
export const ENCRYPTION_PRIVATE_KEY = "encryptionPrivateKey"
export const SENDER_ENCRYPTION_PUBLIC_KEY = "senderEncryptionPublicKey"
export const SHARED_SECRET          = "sharedSecret"

export const ClientInitialized = "ClientInitialized"
export const ClientClosed = "ClientClosed"
export const UserRegistrationStart = "UserRegistrationStart"
export const UserRegistrationStarted = "UserRegistrationStarted"

export const UserAuthenticationStart = "UserAuthenticationStart"
export const UserAuthenticationStarted = "UserAuthenticationStarted"
export const UserOffboardingStart = "UserOffboardingStart"
export const UserOffboardingStarted = "UserOffboardingStarted"

export const DigitalAddressFound = "DigitalAddressFound"
export const DigitalAddressNotFound = "DigitalAddressNotFound"
export const WalletInitialized = "WalletInitialized"
export const DigitalAddressCreated = "DigitalAddressCreated"
export const GeneratedDIDDocument = "GeneratedDIDDocument"
export const IdentityCredentialIssued = "IdentityCredentialIssued"
export const DigitalAddressIDPRegistered = "DigitalAddressIDPRegistered"
export const NotificationSent = "NotificationSent" 

export const IdentityProviderInfoDeleted = "IdentityProviderInfoDeleted"
export const UserCredentialsRevoked = "UserCredentialsRevoked"
export const DigitalAddressIDPDeleted = "DigitalAddressIDPDeleted"
export const DigitalAddressDeleted = "DigitalAddressDeleted"

// PRocess constants
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


// Event 
export const ITRUST_EVENT = "itrust-event"
