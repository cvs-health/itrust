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

import { Fingerprint, PersonAdd } from "@mui/icons-material";
import { Avatar, Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { BackgroundIcon } from "../../utils/UIStyles";

const useStyles = makeStyles((theme) => ({
    gradientHeader: {
        background: `linear-gradient(to right bottom, ${theme.palette.primary.light}, red)`,
        color: theme.palette.primary.contrastText, // Set text color to contrast text
    },
    gradientBody: {
        background: `linear-gradient(to right bottom, black, ${theme.palette.primary.light})`,
        color: theme.palette.primary.contrastText, // Set text color to contrast text
    },
}));

export default function StatCard({ type, title, value, icon, color }) {
    const classes = useStyles();

    return (
        <Card elevation={1} >
            <CardHeader
                title={value}
                titleTypographyProps={{ color: "white", fontSize: "1.6rem", fontWeight: "bold" }}
                subheader={title}
                subheaderTypographyProps={{ color: "#F5F5F5", fontSize: "1rem" }}
                sx={{ textAlign: "center", minHeight: 100 }}
                className={classes.gradientHeader}
                avatar={
                    <Avatar sx={{ bgcolor: "black" }}>
                        {icon}
                    </Avatar>
                }
            />
            
            
        </Card>
        
    );
}
