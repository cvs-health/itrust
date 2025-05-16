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

// Services for the user 
import axiosInstance from "./AxiosInstance";

// Gets the Digital Address with the private Id Guid
export const findDigitalAddressByGUID = async (guid) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/digital_address/privateid/${guid}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Resolve a DID or DA
export const resolveDid = async (didOrDA) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/digital_address/resolve/${didOrDA}`);
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
export const findCredentialMetadata = async (data) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/credential_metadata/search`, data);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        // console.log ('response', response)
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

// Get the metadata with the private Id Guid
export const findMetadataByPrivateIdGuid = async (guid) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/digital_address/privateid/${guid}/metadata`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Get connections with other parties 
export const findConnections = async (data) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/party_relations/search`, data);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Find Connection By ID
export const findConnectionById = async (id) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/party_relations/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Create new connections with other parties 
export const addConnection = async (data) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/party_relations`, data);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Delete connections with other parties
export const deleteConnection = async (id) => {
    try {
        const response = await axiosInstance.delete(`/das/api/v1/party_relations/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}