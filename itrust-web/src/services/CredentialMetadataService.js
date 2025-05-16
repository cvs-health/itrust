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

import keycloak from "../Keycloak";
import axiosInstance, { getAnonymousToken } from "./AxiosInstance";


// Search Digital Address with a criteria
export const searchCredentialMetadata = async (criteria) => {
    try {
        // Add the token to the request header
        const response = await axiosInstance.post(`/das/api/v1/credential_metadata/search`, criteria);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        //console.log ('response', response)
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Search Digital Address with a criteria
export const searchCredentialMetadataByIssuer = async (issuerId) => {
    try {
        // Add the token to the request header
        const response = await axiosInstance.post(`/das/api/v1/credential_metadata/issuer/${issuerId}/search`, {});
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        //console.log ('response', response)
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

