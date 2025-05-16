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

// UserRolesContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { findCurrentUser, getUserByUsername } from "../services/UserService";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);


    useEffect(() => {

      async function getUser() {
            const username = await findCurrentUser();
            //console.log ('username', username)
            
            if (!username) return;
            const user = await getUserByUsername(username);
            setUser(user);
            //console.log("Got user: ", user);

            if(user && user.ID !== 0){
            // iterate through the roles and set the state
            const roles = user.roles.map((role) => role.code);
            setRoles(roles);

            // for each role, iterate through the permissions and set the state
            const permissions = user.roles.flatMap((role) => role.permissions).map((permission) => permission.code);
            setPermissions(permissions);

            setIsInitialized(true);

          }
            

        }
        getUser();
        
    }, []);

    // This object will be accessible to any descendant component
    const contextValue = { user, roles, permissions, isInitialized};

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use the user roles context
export const useAuthContext = () => useContext(AuthContext);
