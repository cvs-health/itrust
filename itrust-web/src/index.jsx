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

import { React, StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";

import App from "./App";
import "./assets/styles/app.css";
import { KEYCLOAK_TOKEN_EXPIRATION } from "./constants";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak";
import DebugContextProvider from "./context/DebugContext";

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

const onKeycloakEvent = (event, error) => {
    console.log('onKeycloakEvent', event, error);
};

const onKeycloakTokens = (tokens) => {
    console.log('onKeycloakTokens', tokens);
};

root.render(

    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
            //onLoad: "login-required",
            checkLoginIframe: true,
            flow: "standard",
            pkceMethod: "S256",
            token: {
                minValidity: KEYCLOAK_TOKEN_EXPIRATION,
            },
        }}
    // onEvent={onKeycloakEvent}
    // onTokens={onKeycloakTokens}
    >
        {/* <StrictMode> */}
        <DebugContextProvider>
            <App />
        </DebugContextProvider>
        {/* </StrictMode> */}
    </ReactKeycloakProvider>
);


