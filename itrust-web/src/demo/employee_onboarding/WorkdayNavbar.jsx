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

import { Add, Public } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { AppBar, Badge, Box, Hidden, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useKeycloak } from "@react-keycloak/web";
import { set } from "date-fns";
import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { hasPermission } from "../../services/UserService";
import logo from "../../assets/images/demo/cvs_logo.png"
import workday_logo from "../../assets/images/demo/workday_logo.png"

const useStyles = makeStyles((theme) => ({
    appBar: {
        boxShadow: "0 1px 8px rgba(0,0,0,.3)",
        position: "relative",
        zIndex: theme.zIndex.drawer + 100,
        [theme.breakpoints.down("sm")]: {
            position: "fixed",
        },
        backgroundColor: "#fff",
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
        margin: "4px 40px 4px 4px",
        //margin: "auto 0",
        lineHeight: "10px",
        //padding: `0 64px 0 0`,
    },
    logo: {
        margin: "auto",
        [theme.breakpoints.down("sm")]: {
            maxWidth: "80px",
        },
    },
}));

export default function WorkdayNavbar({ toggleDrawer }) {
    const classes = useStyles();

    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const handleSettingToggle = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    // Using Object destructuring
    const { keycloak, initialized } = useKeycloak();
    const [profile, setProfile] = useState({});
    const { permissions } = useAuthContext();

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            keycloak.loadUserProfile().then((profile) => {
                setProfile(profile);
            });
        }
    }, []);

    const handleDrawerToggle = () => {
        toggleDrawer();
    };

    const handleNotificationToggle = () => {
        // console.log("toggle notifications");
        setNotificationsOpen(!notificationsOpen);
    };

    const logout = () => {
        console.log("Logging out...");
        keycloak.logout();
    };

    const handleViewDAS = () => {
        //console.log("View DAS");
        navigate("/das/my_das");
    };
    const handleViewTenant = () => {
        //console.log("View Tenant");
        navigate("/tenants/my_tenant");
    }
    const handleViewAccessKeys = () => {
        navigate("/tenants/access_keys");
    }

    const handleAPIDocumentation = () => {
        navigate("/api-docs");
    }

    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar className={classes.toolBar}>
                <Hidden mdUp>
                    <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </Hidden>

                <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" >
                    <img src={logo} alt="Logo" onClick={() => navigate("/")} />
                    <Box flexGrow={1} display="flex" justifyContent="center">
                        <Add color="primary" size="large"/>
                    </Box>
                    <img src={workday_logo} alt="Logo" onClick={() => navigate("/")} />
                </Box>

                <span className="flexSpacer" />
                {profile && (
                    <Box sx={{ display: "flex", flexDirection: "column", marginRight: "40px", color: "black"  }}>
                        <Typography variant="body1" fontWeight="bold">
                            Welcome, {profile.firstName} {profile.lastName}
                        </Typography>
                    </Box>
                )}
            </Toolbar>

            <Menu id="user-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={handleCloseMenu}>
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <Link to="/profile">
                        <ListItemText primary="Profile" />
                    </Link>
                </MenuItem>
                {hasPermission(permissions, "das.manage") && (
                    <MenuItem onClick={handleViewDAS}>
                        <ListItemIcon>
                            <Public />
                        </ListItemIcon>
                        <ListItemText primary="My DAS" />
                    </MenuItem>
                )}
                {!hasPermission(permissions, "das.manage") && hasPermission(permissions, "tenant.manage") && (
                    <MenuItem onClick={handleViewTenant}>
                        <ListItemIcon>
                            <Public />
                        </ListItemIcon>
                        <ListItemText primary="My Tenant" />
                    </MenuItem>
                )}
                <MenuItem onClick={handleViewAccessKeys}>
                    <ListItemIcon>
                        <Public />
                    </ListItemIcon>
                    <ListItemText primary="Access Keys" />
                </MenuItem>
                <MenuItem onClick={handleAPIDocumentation}>
                    <ListItemIcon>
                        <Public />
                    </ListItemIcon>
                    <ListItemText primary="API Documentation" />
                </MenuItem>
                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </MenuItem>
            </Menu>
        </AppBar>
    );
}
