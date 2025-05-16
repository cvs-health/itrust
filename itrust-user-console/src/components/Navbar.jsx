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
/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AppBar, Box, Hidden, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { toProperCase } from "../utils/utils";
import logoImage from '../assets/images/cvs_logo.svg';


const useStyles = makeStyles((theme) => ({
    appBar: {
        boxShadow: "0 1px 8px rgba(0,0,0,.3)",
        position: "relative",
        zIndex: theme.zIndex.drawer + 100,
        [theme.breakpoints.down("sm")]: {
            position: "fixed",
        },
    },
    toolBar: {
        paddingLeft: 1 / 2,
        paddingRight: 1 / 2,
    },
    branding: {
        display: "flex",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        margin: "2px 10px 2px 2px",
        //margin: "auto 0",
        lineHeight: "4px",
        //padding: `0 64px 0 0`,
    },
    
}));

export default function Navbar({ toggleDrawer }) {
    const classes = useStyles();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const handleSettingToggle = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    // Using Object destructuring
    const { keycloak, initialized } = useKeycloak();
    const [profile, setProfile] = useState({});

    useEffect(() => {
        async function setUserAttributes() {
            try {
                const profile = await keycloak.loadUserProfile();
                const userAttributes = keycloak.tokenParsed;
                setProfile({
                    ...profile,
                    firstName: profile?.firstName,
                    lastName: profile?.lastName,
                    digitalAddress: userAttributes?.digitalAddress,
                })
            } catch (error) {
                console.error("Failed to load user profile", error);
            }

        }
        if (initialized && keycloak.authenticated && keycloak.tokenParsed) {
            setUserAttributes()
        }
    }, []);

    const handleDrawerToggle = () => {
        toggleDrawer();
    };

    const handleShowProfile = () => {
        navigate("/profile");
    }

    const logout = () => {
        console.log("Logging out...");
        navigate("/");
        keycloak.logout();
    };


    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar className={classes.toolBar}>
                <Hidden mdUp>
                    <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </Hidden>

                <div className={classes.branding}>
                    <img src={logoImage} alt="Logo" onClick={() => navigate("/")} style={{ height: 20, width: 150, marginBottom: 2 }} />
                </div>

                <Box sx={{ display: { xs: "none", md: "block", lg: "block" } }}>
                    <Typography variant="h5">iTrust - User Console</Typography>
                    <Typography variant="body1">Manage your identity</Typography>
                </Box>

                <span className="flexSpacer" />
                {profile && (
                    <Box sx={{ display: "flex", flexDirection: "column", marginRight: "40px" }}>
                        <Typography variant="body1">Welcome {toProperCase(profile?.firstName)},</Typography>
                        <Typography variant="body2">{profile?.digitalAddress}</Typography>

                    </Box>
                )}

                <IconButton
                    aria-label="User Settings"
                    aria-owns={anchorEl ? "user-menu" : null}
                    aria-haspopup="true"
                    color="inherit"
                    onClick={handleSettingToggle}
                >
                    <MoreVertIcon />
                </IconButton>
            </Toolbar>

            <Menu id="user-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={handleShowProfile}>
                    <ListItemIcon>
                        <AccountCircle color="primary"/>
                    </ListItemIcon>
                    <Link to="/profile">
                        <ListItemText primary="Profile" />
                    </Link>
                </MenuItem>

                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <LogoutIcon color="primary"/>
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </MenuItem>
            </Menu>
        </AppBar>
    );
}
