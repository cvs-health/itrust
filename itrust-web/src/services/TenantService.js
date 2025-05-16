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

// Find All Tenant
export const findTenants = async () => {
    try {
        const response = await axiosInstance.get("/das/api/v1/tenants");
        console.log ('response', response)
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find Tenant By ID
export const findTenantById = async (id) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/tenants/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Save Tenant
export const saveTenant = async (data) => {
    try {
        //console.log ('data', data)
        const response = await axiosInstance.post("/das/api/v1/tenants", data);
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

// Update Tenant
export const updateTenant = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/das/api/v1/tenants/${id}`, data);
        // if(response.status !== 200) {
        //     throw new Error("Network response was not ok");
        // }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Delete Tenant
export const deleteTenant = async (id) => {
    try {
        const response = await axiosInstance.delete(`/das/api/v1/tenants/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Send invitation mail to tenant admin 
export const sendTenantAdminInvite = async (data) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/tenants/${data.tenantId}/invite`, data);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        console.log ('response', response)
        //return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

export const countTenants = async () => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/tenants/count`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}


// Find All Allowed Credentials
export const findTenantAllowedCredentials = async (tenantId) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/tenants/${tenantId}/allowed-credentials`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Save Allowed Credential
export const saveAllowedCredential = async (tenantId, data) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/tenants/${tenantId}/allowed-credentials`, data);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Delete Allowed Credential
export const deleteAllowedCredential = async (tenantId, credentialId) => {
    try {
        const response = await axiosInstance.delete(`/das/api/v1/tenants/${tenantId}/allowed-credentials/${credentialId}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};