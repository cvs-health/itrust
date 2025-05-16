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

import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppProvider from "./context/AppContext";

import Home from "./pages/Containers/Home";
import NotFound from "./pages/NotFound";

import { useKeycloak } from "@react-keycloak/web";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContextProvider } from "./context/AuthContext";
import CredentialView from "./pages/Credentials/CredentialView";
import InterviewList from "./demo/employee_onboarding/InterviewList";
import Landing from "./pages/Landing";

function App() {
    const { keycloak, initialized } = useKeycloak();

    //console.log ('Token: ', keycloak.token);
    // useEffect(() => {
    //     if (keycloak?.token) {
    //         // console.log("Token: ", keycloak.token);
    //         const decodedToken = jwtDecode(keycloak.token);
    //         //console.log('Decoded JWT:', JSON.stringify(decodedToken, null, 2));
    //     }
    // }, [keycloak?.token]);

    return (
        initialized && (
            <AuthContextProvider>
                <AppProvider>
                    <Router basename="/itrust-user-console" futureFlags={{ v7_startTransition: true }}>
                        <Routes>
                        {!keycloak?.token && <Route exact path="/" element={<Landing />} />}
                        <Route exact path="/404" element={<NotFound />} />
                            <Route exact path="/credential/view/:id" element={<CredentialView />} />

                            {/* Demo URLs */}
                            <Route exact path="/demo/interviews" element={<InterviewList />} />

                            <Route exact path="/*" element={<ProtectedRoute component={Home} />} />
                        </Routes>
                    </Router>
                </AppProvider>
            </AuthContextProvider>
        )
    );
}

export default App;
