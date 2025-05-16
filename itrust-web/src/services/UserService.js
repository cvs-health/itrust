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
import keycloak from '../Keycloak';


// Find current user from the token
export const findCurrentUser = async () => {
    // console.log ('Keycloak Token: ', keycloak.token);
    if (keycloak.token) {
        const username = keycloak.tokenParsed.preferred_username;
        return username
    }
    return null
}

// Get the user by username 
export const getUserByUsername = async (username) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/users/username/${username}`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

//Get the user permissions 
export const getUserPermissions = async (id) => {
    try {
        const response = await axiosInstance.get(`/das/api/v1/users/${id}/permissions`);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
}

// Check if the user has a specific role 
export const hasRole = async (role) => {
    const username = await findCurrentUser();
    const user = await getUserByUsername(username);
    return user.roles.some(r => r.code === role || r.name === role);
    
}

// Check if the user has a specific permission
// export const hasPermission = async (permission) => {
//     const username = await findCurrentUser();
//     const user = await getUserByUsername(username);
//     const permissions = await getUserPermissions(user.ID);
//     return permissions.some(p => p.code === permission || p.name === permission);
// }

export const hasPermission = (allowed, permission ) => {
    return allowed.some(p => p === permission);
}

// Send invitation mail to user
export const sendUserInvite = async (data) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/users/${data.email}/invite`, data);
        if(response.status !== 200) {
            throw new Error("Network response was not ok");
        }
        //return response.data.data;
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error;
    }
};