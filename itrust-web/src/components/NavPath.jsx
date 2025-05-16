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

import { Link, useLocation } from "react-router-dom";
import { Box, Breadcrumbs, Paper} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: 1,
    marginBottom: 1
  }
}));

export default function NavPath() {
  const classes = useStyles();
  const location = useLocation();
  let currentLink = ''
  const crumbs = location.pathname
    .split("/")
    .filter(crumb => crumb !== '')
    .map(crumb => {
        currentLink = currentLink+'/'+crumb
        return (
          <Link key={crumb} to={currentLink}>{crumb}</Link> 
        )
    });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: 'start', alignContent: 'center', justifyContent: 'center'}}>
      <Paper elevation={0} className={classes.root}>
      <Breadcrumbs aria-label="breadcrumb"
        sx= { {backgroundColor: 'white', fontSize: 14, color: 'primary.main', marginBottom: 2}}>
        {crumbs}
      </Breadcrumbs>
      </Paper>  
      </Box>

  )
  
    
}
