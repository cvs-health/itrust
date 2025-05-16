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

// keycloak.js
import Keycloak from "keycloak-js";
import { KEYCLOAK_BASE_URL, KEYCLOAK_CLIENT, KEYCLOAK_REALM } from "./constants";

const keycloakConfig = {
    url: `${KEYCLOAK_BASE_URL}`, // Keycloak server URL
    realm: `${KEYCLOAK_REALM}`, // Replace with your realm name
    clientId: `${KEYCLOAK_CLIENT}`, // Replace with your client ID
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
