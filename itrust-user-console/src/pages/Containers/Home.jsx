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

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-key */

import { makeStyles } from "@mui/styles";
import { Footer, Navbar, Sidebar } from "../../components";

import { Box } from "@mui/system";

import React, { useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

import * as routes from "../../routes";
import Workspace from "./Workspace";

import NavPath from "../../components/NavPath";


const useStyles = makeStyles((theme) => ({
  root: {
    padding: 1,
    marginBottom: 1,
  },
  form: {
    padding: 1,
    marginBottom: 1,
  },
}));

export default function Home({ history }) {
  const classes = useStyles();
  const [opened, setOpened] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  

  const resizeDispatch = () => {
    if (typeof Event === "function") {
      window.dispatchEvent(new Event("resize"));
    } else {
      const evt = window.document.createEvent("UIEvents");
      evt.initUIEvent("resize", true, false, window, 0);
      window.dispatchEvent(evt);
    }
  };

  const handleDrawerToggle = () => {
    setOpened(!opened);
    resizeDispatch();
  };

  const handleNotificationToggle = () =>
    setNotificationsOpen(!notificationsOpen);

  const getRoutes = (
    <Routes>
      {routes.routePaths.map((item, index) =>
        item.type === "external" ? (
          <Route
            exact
            path={item.path}
            element={item.component}
            name={item.name}
            key={index}
          />
        ) : item.type === "submenu" ? (
          item.children.map((subItem) => (
            <Route
              exact
              path={`${item.path}${subItem.path}`}
              element={subItem.component}
              name={subItem.name}
            />
          ))
        ) : (
          <Route
            exact
            path={item.path}
            element={item.component}
            name={item.name}
            key={index}
          />
        )
      )}
    </Routes>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: '100vh', width: '100vw' }}>
        <>
          <Navbar toggleDrawer={handleDrawerToggle} />
         <Box display="flex" flexDirection="row" alignItems="top" pb={20} 
          >
            <Sidebar
              routes={routes.routePaths}
              opened={opened}
              toggleDrawer={handleDrawerToggle}
              flexShrink={1}
              minwidth={240}

            />
            
            <Workspace opened={opened} flexGrow={0}>
              {/* Show Breadcrumbs */}
              {/* <NavPath /> */}

              {getRoutes}
              </Workspace>
          </Box>

          <Footer />
          </>

      

    </Box>
  );
}
