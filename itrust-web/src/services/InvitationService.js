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

// Find All Invitation
export const findInvitations = async () => {
    try {
        const response = await axiosInstance.get("/das/api/v1/invitations");
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Find Invitation By ID
export const findInvitationById = async (id) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/invitations/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

export const findInvitationByCode = async (code) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/invitations/code/${code}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

export const findInvitationsByCriteria = async (criteria) => {
    try {
        const response = await axiosInstance.post("/das/api/v1/invitations/search", JSON.stringify(criteria));
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Save Invitation
export const saveInvitation = async (data) => {
    try {
        //console.log ('data', data)
        const response = await axiosInstance.post("/das/api/v1/invitations", data);
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Update Invitation
export const updateInvitation = async (id, data) => {
    try {

        let token 
        // check if the user has logged in
        if (!keycloak.authenticated) {   
            // console.log ('User has not logged in')
            token = await getAnonymousToken();
            // console.log ('Temporary Token: ', token)
        }

        // Add the token to the request header

        const response = await axiosInstance.put(`/das/api/v1/invitations/${id}`, data, {
            headers: {
            Authorization: `Bearer ${token || keycloak.token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Mark Invitation as Complete
export const completeInvitation = async (id) => {
    try {

        let token 
        // check if the user has logged in
        if (!keycloak.authenticated) {   
            // console.log ('User has not logged in')
            token = await getAnonymousToken();
            // console.log ('Temporary Token: ', token)
        }

        // Add the token to the request header

        const response = await axiosInstance.put(`/das/api/v1/invitations/${id}/complete`, {}, {
            headers: {
            Authorization: `Bearer ${token || keycloak.token}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Delete Invitation
export const deleteInvitation = async (id) => {
    try {
        const response = await axiosInstance.delete(`/das/api/v1/invitations/${id}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};

// Send invitation mail to invitation admin 
export const sendAdminInvite = async (data) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/invitations/${data.invitationId}/invite`, data);
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


// Register a user with account 
export const registerWithAccount = async (formData, invitationCode) => {
    console.log ('formData', formData)  
    try {
        const response = await axiosInstance.post(`/das/api/v1/register/${invitationCode}`, formData);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

