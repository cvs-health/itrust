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

/* eslint-disable array-callback-return */
import React from "react";
import { Hidden, List, Paper, SwipeableDrawer, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import SidebarItem from "./SidebarItem";
import { hasPermission } from "../services/UserService";
import { useAuthContext } from "../context/AuthContext";


const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: 1,
    padding: 1,
  },
  drawerPaper: {
    height: "100%",
    zIndex: theme.zIndex.drawer + 99,
  },
  modal: {
    [theme.breakpoints.down("sm")]: {
      top: "56px!important",
    },
    [theme.breakpoints.up("sm")]: {
      top: "64px!important",
    },
    zIndex: "1000!important",
  },
  backdrop: {
    [theme.breakpoints.down("sm")]: {
      top: "56px",
    },
    [theme.breakpoints.up("sm")]: {
      top: "64px",
    },
  },
}));

export default function Sidebar({ opened, toggleDrawer, routes }) {
  const classes = useStyles();
  const [activeRoute, setActiveRoute] = useState(undefined);

  const toggleMenu = (index) => {
    setActiveRoute(activeRoute === index ? undefined : index);
    toggleDrawer();
  }

  const menu = (
    <List component="div">
      {routes.map((route, index) => {
        const isCurrentPath = false;
        if (route.type !== "custom") {
          return (
            <SidebarItem
              key={index}
              index={index}
              route={route}
              activeRoute={activeRoute}
              toggleMenu={toggleMenu}
              currentPath={isCurrentPath}
            />
          );
        }
      })}
    </List>
  );

  return (
    <>
      <Hidden smDown>
        <Paper elevation={2} className={classes.root}>
          {menu}
        </Paper>
      </Hidden>
      <Hidden mdUp>
        <SwipeableDrawer
          variant="temporary"
          anchor="left"
          open={opened}
          onClose={toggleDrawer}
          onOpen={toggleDrawer}
          onBackdropClick={toggleDrawer}
        >
          <Toolbar />
          <Paper elevation={2} className={classes.root}>
            {menu}
          </Paper>
        </SwipeableDrawer>
      </Hidden>
    </>
  );
}

