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

import axiosInstance from "./AxiosInstance";

// Find All CredentialSchema
export const findCredentialSchemas = async () => {
    try {
        const response = await axiosInstance.get("/das/api/v1/credential_schemas");
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find CredentialSchema By ID
export const findCredentialSchemaById = async (id) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/credential_schemas/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Find Credential Schema by code and Version 
export const findCredentialSchemaByCodeAndVersion = async (code, version) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/credential_schemas/code/${code}/version/${version}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Save CredentialSchema
export const saveCredentialSchema = async (data) => {
    try {
        //console.log ('data', data)
        const response = await axiosInstance.post("/das/api/v1/credential_schemas", data);
        //console.log (response)
        // if(response.statusText!== "OK") {
        //     throw new Error("Network response was not ok");
        // }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Update CredentialSchema
export const updateCredentialSchema = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/das/api/v1/credential_schemas/${id}`, data);
        // if(response.status !== 200) {
        //     throw new Error("Network response was not ok");
        // }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Delete CredentialSchema
export const deleteCredentialSchema = async (id) => {
    try {
        const response = await axiosInstance.delete(`/das/api/v1/credential_schemas/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find CredentialSchemaAttribute By ID
export const findCredentialSchemaAttributeById = async (id) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/credential_schema_attributes/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Save CredentialSchemaAttribute
export const saveCredentialSchemaAttribute = async (data) => {
    try {
        //console.log ('data', data)
        const response = await axiosInstance.post("/das/api/v1/credential_schema_attributes", data);
        //console.log (response)
        // if(response.statusText!== "OK") {
        //     throw new Error("Network response was not ok");
        // }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Update CredentialSchemaAttribute
export const updateCredentialSchemaAttribute = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/das/api/v1/credential_schema_attributes/${id}`, data);
        // if(response.status !== 200) {
        //     throw new Error("Network response was not ok");
        // }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Delete CredentialSchemaAttribute
export const deleteCredentialSchemaAttribute = async (id) => {
    try {
        const response = await axiosInstance.delete(`/das/api/v1/credential_schema_attributes/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};


