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
export const ROWS_PER_PAGE = parseInt(import.meta.env.VITE_ROWS_PER_PAGE) || 25
// DAS Configuration 
export const DAS_IDENTIFIER = import.meta.env.VITE_DAS_IDENTIFIER || 'CVS'


export const API_GATEWAY = import.meta.env.VITE_API_GATEWAY
export const ITRUST_LOGIN_URL = import.meta.env.VITE_ITRUST_LOGIN_URL
// Keycloak 
export const KEYCLOAK_BASE_URL = import.meta.env.VITE_KEYCLOAK_BASE_URL
export const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM
export const KEYCLOAK_CLIENT = import.meta.env.VITE_KEYCLOAK_CLIENT
export const KEYCLOAK_TOKEN_EXPIRATION = import.meta.env.VITE_KEYCLOAK_TOKEN_EXPIRATION

export const STANDARD_DELAY = 1000

// Display Types 
export const DISPLAY_LIST = "list"
export const DISPLAY_CARD = "card"