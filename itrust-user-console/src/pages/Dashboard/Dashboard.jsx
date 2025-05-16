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

import {
  BrandingWatermark,
  Business,
  Reply,
  VerifiedUser,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { GridLoader } from "react-spinners";
import { Link } from "react-router-dom";

export default function Dashboard({ refresh }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    issuers: 0,
    totalVCsIssued: 0,
    verifications: 0,
  });

  useEffect(() => {
    async function getStats() {
      setLoading(true);
      setTimeout(() => {
        setStats({
          issuers: 3,
          totalVCsIssued: 12,
          verifications: 300,
        });
        setLoading(false);
      }, 1000);
    }
    getStats();
    // console.log ('User: ', user)
  }, [refresh]);

  return loading ? (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="70vw"
      height="70vh"
    >
      <GridLoader color="purple" />
    </Box>
  ) : (
    <Box display="flex" flexDirection="column" gap={1}>
      <Card>
        <CardHeader
          title="Dashboard"
          titleTypographyProps={{ color: "primary.main", variant: "headline" }}
          subheader="Your Central Hub for Real-Time Insights and Actionable Data"
          action={
            <Button startIcon={<Reply />} color="warning">
              Back
            </Button>
          }
        />
        <Divider />
      </Card>
      <Card>
        <CardHeader
          title="My Timeline"
          titleTypographyProps={{ color: "primary.main", variant: "subtitle1" }}
        />
        <CardContent>Work in Progress</CardContent>
      </Card>

      <Card>
        <CardHeader
          title="My Network"
          titleTypographyProps={{ color: "primary.main", variant: "subtitle1" }}
        />
        <CardContent>Work in Progress</CardContent>
      </Card>
    </Box>
  );
}
