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
import { Alert, Snackbar } from "@mui/material";
import React from "react";

export default function StatusMessage({ status, changeStatus }) {
  const closeFunction = () => {
    changeStatus ( {
      ...status,
      open:  false
    }) 
  };

  return (
    <Snackbar
      open={status.open}
      autoHideDuration={2 * 1000}
      onClose={closeFunction}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={closeFunction}
        severity={status.type}
        sx={{ width: "100%" }}
      >
        {status.message}
      </Alert>
    </Snackbar>
  );
}
