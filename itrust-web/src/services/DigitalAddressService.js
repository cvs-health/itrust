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

// Create a Digital Address
export const createDigitalAddress = async (data) => {
    try {
        let token 
        // check if the user has logged in
        if (!keycloak.authenticated) {   
            token = await getAnonymousToken();
        }
        // Add the token to the request header
        const response = await axiosInstance.post(`/das/api/v1/digital_address`, data, {
            headers: { Authorization: `Bearer ${token || keycloak.token}` }
        });
        if(response.status !== 201) {
            throw new Error("Network response was not ok");
        }
        //console.log ('response', response)
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Create a Digital Address
export const linkDigitalAddress = async (data) => {
    try {
        let token 
        // check if the user has logged in
        if (!keycloak.authenticated) {   
            token = await getAnonymousToken();
        }

        // Add the token to the request header
        const response = await axiosInstance.post(`/das/api/v1/digital_address/link`, data, {
            headers: { Authorization: `Bearer ${token || keycloak.token}` }
        });
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
export const searchDigitalAddress = async (criteria) => {
    try {
        // Add the token to the request header
        const response = await axiosInstance.post(`/das/api/v1/digital_address/search`, criteria);
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
export const searchDigitalAddressByIssuer = async (issuerId) => {
    try {
        // Add the token to the request header
        const response = await axiosInstance.post(`/das/api/v1/digital_address/issuer/${issuerId}/search`, {});
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

// Resolve a DID 
export const resolveDid = async (did) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/digital_address/resolve/${did}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }

}

// Get Credential Metadata 
export const getCredentialMetadata = async (data) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/credential_metadata/search`, data);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Get the Credential by Credential Id
export const findCredentialByCredentialId = async (id) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/credentials/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// issue a Credential
export const issueCredential = async (did, data) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/digital_address/${did}/issue`, data);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}




// Revoke a Credential 
export const revokeCredential = async (did, credentialId) => {
    try {
        const response = await axiosInstance.delete(`/das/api/v1/digital_address/${did}/revoke/${credentialId}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Count the number of Digital Addresses
export const countDigitalAddresses = async (did) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/digital_address/count/${did}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Count the number of Digital Addresses
export const countCredentials = async (did) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/credentials/count/${did}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

