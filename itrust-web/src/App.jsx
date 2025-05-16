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

import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppProvider from "./context/AppContext";

import Home from "./pages/Containers/Home";
import NotFound from "./pages/NotFound";

import { useKeycloak } from "@react-keycloak/web";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Onboarding/Register";
import { AuthContextProvider } from "./context/AuthContext";
import VerifyIssuerInfo from "./pages/Onboarding/VerifyIssuerInfo";
import VerifyBiometricInfo from "./pages/Onboarding/VerifyBiometricInfo";
import VerifyGovernmentIdentity from "./pages/Onboarding/VerifyGovernmentIdentity";
import ViewDigitalAddress from "./pages/Onboarding/ViewDigitalAddress";
import CandidateList from "./demo/employee_onboarding/CandidateList";
import MockWorkdayRecruiting from "./demo/employee_onboarding/MockWorkdayRecruiting";

function App() {
    const { keycloak, initialized } = useKeycloak();

    return (
        initialized && (
            <AuthContextProvider>
                <AppProvider>
                    <Router basename="/itrust-web" futureFlags={{ v7_startTransition: true }}>
                        <Routes>
                            <Route exact path="/404" element={<NotFound />} />
                            <Route exact path="/register" element={<Register />} />
                            <Route exact path="/digital_address/view" element={<ViewDigitalAddress />} />
                            <Route exact path="/digital_address/verify_issuer_info" element={<VerifyIssuerInfo />} />
                            <Route exact path="/digital_address/verify_biometric" element={<VerifyBiometricInfo />} />
                            <Route exact path="/digital_address/verify_government_id" element={<VerifyGovernmentIdentity />} />

                            {/* Demo URLs */}
                            <Route exact path="/demo/mock-workday" element={<MockWorkdayRecruiting />} />
                            <Route exact path="/demo/candidates" element={<CandidateList />} />

                            <Route exact path="/*" element={<ProtectedRoute component={Home} />} />
                        </Routes>
                    </Router>
                </AppProvider>
            </AuthContextProvider>
        )
    );
}

export default App;
