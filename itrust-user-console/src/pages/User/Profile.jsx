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
import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import StatusMessage from '../../components/StatusMessage';
import { Close, Reply } from '@mui/icons-material';
import { useAuthContext } from '../../context/AuthContext';
import { toProperCase } from '../../utils/utils';
import * as Constants from "../../constants";
import { useKeycloak } from '@react-keycloak/web';

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [launchUrl, setLaunchUrl] = useState("");
  const { keycloak } = useKeycloak();

  // Dialog states 
  const [openVerify, setOpenVerify] = useState(false);


  useEffect(() => {
    setLoading(true);
    const launchUrl = `${Constants.ITRUST_LOGIN_URL}?op=del&did=${user?.did}`
    console.log ('Launch URL: ', launchUrl)
    setLaunchUrl(launchUrl)

    // Add a window listener 
    window.addEventListener('message', function (event) {
      if (event.data.type === 'itrust-event') {
        // close the dialog 
        setOpenVerify(false)
        setStatus({
          open: true,
          type: "success",
          message: "Your Digital Address has been deleted. You will be logged off.",
      });
      // Log the user off 
      navigate ("/")
      try {
        keycloak.logout();
      }catch (error) {
        console.error('Error logging off user: ', error)
      }
      }
    }, false)

    
    setLoading(false)
  }, [])

  const handleBack = () => {
    navigate(-1);
  };

  const handleDeleteDigitalAddress = () => {
    console.log('Delete Digital Address: ', user?.digitalAddress)
    console.log ('Launch URL: ', launchUrl) 
    setOpenVerify(true);
  }

  const handleCloseVerify = () => {
    setOpenVerify(false);
  };


  return loading ? (
    <Box display="flex" flexDirection="column" width="70vw" height="70vh" justifyContent="center" alignItems="center">
      <GridLoader color="purple" />
    </Box>
  ) : (
    <Box display="flex" flexDirection="column" gap={1}>
      <StatusMessage status={status} changeStatus={setStatus} />
      <Card elevation={0}>
        <CardHeader
          title="My Profile"
          titleTypographyProps={{ color: "primary.main", variant: "headline" }}
          action={
            <>
              <Button startIcon={<Reply />} onClick={handleBack} color="info">
                Back
              </Button>
            </>
          }
        />
        <Divider />
      </Card>
      <Card>
        <CardContent>
          {user && <Box display="flex" flexDirection="column">
            <Typography variant="body1" fontWeight={"bold"}>
              First Name
            </Typography><Typography variant="body1" gutterBottom>
              {toProperCase(user?.firstName) || ""}
            </Typography>
            <Typography variant="body1" fontWeight={"bold"}>
              Last Name
            </Typography><Typography variant="body1" gutterBottom>
              {toProperCase(user?.lastName) || ""}
            </Typography>
            <Typography variant="body1" fontWeight={"bold"}>
              Digital Address
            </Typography><Typography variant="body1" gutterBottom>
              {user?.digitalAddress || "N.A."}
            </Typography>
            <Typography variant="body1" fontWeight={"bold"}>
              DID
            </Typography><Typography variant="body1" gutterBottom>
              {user?.did || "N.A."}
            </Typography>
          </Box>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Danger Zone"
          titleTypographyProps={{ color: "red", variant: "headline" }}>
        </CardHeader>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
            <Typography variant="body1">Deleting your Digital Address will make all linked data inaccessible. Proceed with caution</Typography>
            <Button variant="contained" color="error" onClick={handleDeleteDigitalAddress}>
              Delete My Digital Address
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {user && launchUrl && <Dialog 
        open={openVerify} onClose={handleCloseVerify} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" 
        scroll="paper" maxWidth="sm" fullWidth>
        <DialogTitle id="alert-dialog-title">
          <IconButton
            aria-label="close"
            onClick={handleCloseVerify}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>&nbsp;
          </DialogTitle>
        <DialogContent sx={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100vw" height="75vh">
            <iframe id="itrust-face" title="Face Panel" src={launchUrl} allow="camera *;microphone *" style={{ WebkitOverflowScrolling: "touch", overflow: "auto", border: 0, width: "100%", height: "100%" }}></iframe>
          </Box>
        </DialogContent>
      </Dialog>}
    </Box>
  )
}
