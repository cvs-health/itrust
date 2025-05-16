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

// Start a Process 
export const initiateProcess = async (data) => {
    try {
        const response = await axiosInstance.post("/das/api/v1/process/start", data);
        // console.log ('Started Process: ', response.data.data)
        if (response.status !== 201) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}


// Get the status of the process 
export const getProcessStatus = async (processId) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/process/${processId}/status`);
        if (response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

export const getProcessStepStatus = async (processId, stepCode) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/process/${processId}/step/${stepCode}/status`);
        if (response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}