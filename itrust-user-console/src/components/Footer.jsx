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
import { makeStyles } from "@mui/styles"
import { Box } from '@mui/material'

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    position: 'fixed',
    paddingTop: 2,
    paddingLeft: 2,
    bottom:0,
    background: '#000000',
    color: '#fff',
    height: '2rem', 
    width: '100%',
    //marginTop: "auto"
  }
}))

export default function Footer() {
  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <div>© {new Date().getFullYear()} CVS Health Corporation, All rights reserved</div>
    </Box>
  )
}
