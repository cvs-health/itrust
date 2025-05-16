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

import keycloak from '../Keycloak';
import axiosInstance from "./AxiosInstance";

// Find current user from the token
export const findCurrentUser = async () => {
    //console.log ('Keycloak Token: ', keycloak.token);
    if (keycloak.token) {
        const username = keycloak.tokenParsed.preferred_username;
        return username
    }
    return null
}

// Get the user by username 
export const getUserDetail = async () => {
    let user = {}
    if (keycloak.token) {
        const profile = await keycloak.loadUserProfile()
        const userAttributes = keycloak.tokenParsed;
        //console.log('User Attributes: ', userAttributes)
        user = {
            ...user,
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            did: userAttributes?.did,
            digitalAddress: userAttributes?.digitalAddress
            ,
        }
    }
    return user;
}


// Update the CVS ID 
export const saveCVSUser = async (payload) => {
    try {
        const response = await axiosInstance.post(`/das/api/v1/user/register`, payload);
        return response.data.data;
    }catch (error) {
        console.error("There was a problem with the post operation:", error);
        throw error;
    }
}