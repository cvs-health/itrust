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

import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import backgroundCoverImage from '../assets/images/cover.jpg';
import logoImage from '../assets/images/cvs_logo.svg';
import { useKeycloak } from "@react-keycloak/web";

export default function Landing() {
    const { keycloak, initialized } = useKeycloak();

    const handleLogin = () => {
        console.log('Handle Login')
        keycloak.login()
    }
    const handleRegister = () => {
        console.log('Handle Register')
        keycloak.register();
    }
  
    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh',
            backgroundImage: `url(${backgroundCoverImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
        }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 4, backgroundColor: 'white', borderRadius: '10px', boxShadow: 4, maxWidth: 300, width: '100%' }}>
                <Box component="img" src={logoImage} sx={{ height: 20, width: 150, marginBottom: 2 }} />
                {initialized && <Stack spacing={2} width="100%">   
                    <Typography variant="h4" textAlign="center" color="primary" gutterBottom>Welcome to iTrust</Typography>
                    <Button variant="contained" onClick={handleLogin} fullWidth>Login</Button>
                    <Button variant="contained" onClick={handleRegister} fullWidth>Register</Button>
                </Stack>}
            </Box>
        </Box>
    );
}
