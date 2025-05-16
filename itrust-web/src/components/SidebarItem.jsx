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

import React from 'react'
import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from "@mui/material"
import { makeStyles } from "@mui/styles"
import { capitalize } from "../utils/utils"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import { NavLink } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  badge: {
    width: "20px",
    height: "20px",
    display: "flex",
    zIndex: 1,
    flexWrap: "wrap",
    fontSize: "0.75rem",
    alignItems: "center",
    borderRadius: "50%",
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  menuLink: {
    position: "relative",
    display: "block",
  },
  menuItem: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 1 * 1.5,
    paddingBottom: 1 * 1.5,
  },
  menuIcon: {
    marginLeft: 1 * 2,
    marginRight: 1 * 2,
  },
  menuSubItem: {
    paddingLeft: "55px",
    paddingRight: "55px",
    paddingTop: 1 * 1.5,
    paddingBottom: 1 * 1.5,
  },
  menuCollapsed: {
    backgroundColor: theme.palette.action.hover,
  },
  menuActive: {
    backgroundColor: theme.palette.action.hover,
  },
  menuClosed: {
    backgroundColor: "transparent",
  },
  caret: {
    marginLeft: 1 * 2,
    marginRight: 1 * 2,
    minWidth: 0,
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}))

export default function SidebarItem({
  route,
  index,
  activeRoute,
  toggleMenu,
  currentPath,
}) {
  const classes = useStyles()

  const badge = (badge) => {
    if (!badge) return
    return (
      <Typography className={classes.badge} component="div">
        {badge.value}
      </Typography>
    )
  }

  if (route.type === "external") {
    return (
      <a
        href={route.path}
        target="_blank"
        rel="noopener noreferrer"
        key={index}
        className={classes.menuLink}
      >
        <ListItem className={classes.menuItem} button>
          <ListItemIcon>
            <route.icon className={classes.menuIcon} color="primary"/>
          </ListItemIcon>
          <Typography variant="body1" className="flexSpacer">
            {capitalize(route.name)}
          </Typography>
          {badge(route.badge)}
        </ListItem>
      </a>
    )
  }

  if (route.type === "external") {
    return (
      <a
        href={route.path}
        target="_blank"
        rel="noopener noreferrer"
        key={index}
        className={classes.menuLink}
      >
        <ListItem className={classes.menuItem} button>
          <ListItemIcon>
            <route.icon className={classes.menuIcon} color="primary"/>
          </ListItemIcon>
          <Typography variant="body1" className="flexSpacer">
            {capitalize(route.name)}
          </Typography>
          {badge(route.badge)}
        </ListItem>
      </a>
    )
  }

  if (route.type === "submenu") {
    return (
      <div
        className={
          activeRoute === index ? classes.menuCollapsed : classes.menuClosed
        }
      >
        <ListItem
          className={classes.menuItem}
          button
          key={index}
          onClick={() => toggleMenu(index)}
        >
          <ListItemIcon>
            <route.icon className={classes.menuIcon} color="primary"/>
          </ListItemIcon>
          <Typography variant="body1" className="flexSpacer">
            {capitalize(route.name)}
          </Typography>
          {badge(route.badge)}
          <ListItemIcon className={classes.caret}>
            {activeRoute === index ? (
              <ArrowDropUpIcon />
            ) : (
              <ArrowDropDownIcon />
            )}
          </ListItemIcon>
        </ListItem>
        <Collapse
          in={activeRoute === index ? true : false}
          timeout="auto"
          unmountOnExit
        >
          <List disablePadding>
            {route.children.map((subitem, index) => (
              <NavLink
                to={`${route.path ? route.path : ""}${
                  subitem.path ? subitem.path : ""
                }`}
                exact="true"
                className={ ( {isActive, isPending}) => 
                  isPending? classes.menuLink: isActive? classes.menuActive: ""
                }
                key={index}
              >
                <ListItem className={classes.menuSubItem} button>
                  <Typography variant="body1" className="flexSpacer" sx={{ marginLeft: 2}}>
                    {capitalize(subitem.name)}
                  </Typography>
                  {badge(subitem.badge)}
                </ListItem>
              </NavLink>
            ))}
          </List>
        </Collapse>
      </div>
    )
  }

  return (
    <NavLink
      to={route.path}
      exact="true"
      className={ ( {isActive, isPending}) => 
                  isPending? classes.menuLink: isActive? classes.menuActive: ""
                }
      key={index}
    >
      <ListItem
        className={classes.menuItem}
        button
        onClick={() => toggleMenu(index)}
      >
        <ListItemIcon>
          <route.icon className={classes.menuIcon} color="primary"/>
        </ListItemIcon>
        <Typography variant="body1" className="flexSpacer">
          {capitalize(route.name)}
        </Typography>
        {badge(route.badge)}
      </ListItem>
    </NavLink>
  )
}
