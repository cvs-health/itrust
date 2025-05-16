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

// Find All DAS
export const findDAS = async () => {
    try {
        const response = await axiosInstance.get("/das/api/v1/das");
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find DAS By ID
export const findDASById = async (id) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/das/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Find DAS By Identifier 
export const findDASByIdentifier = async (identifier) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/das/identifier/${identifier}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Save DAS
export const saveDAS = async (data) => {
    try {
        const response = await axiosInstance.post("/das/api/v1/das", data);
        // if(response.statusText!== "OK") {
        //     throw new Error("Network response was not ok");
        // }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Update DAS
export const updateDAS = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/das/api/v1/das/${id}`, data);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Delete DAS
export const deleteDAS = async (id) => {
    try {
        const response = await axiosInstance.delete(`/das/api/v1/das/${id}`);
        console.log("Delete DAS response: ", response);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};


// Send invitation mail to DAS admin 
export const sendAdminInvite = async (data) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/das/${data.dasId}/invite`, data);
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
