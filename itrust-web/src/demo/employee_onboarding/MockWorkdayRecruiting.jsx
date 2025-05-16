import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles';
import React from 'react'
import talent_image from '../../assets/images/demo/workday-talent-acquisition-job-req.png';

const useStyles = makeStyles((theme) => ({
  standardImage: {
    display: "flex",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    margin: "4px 40px 4px 4px",
    //margin: "auto 0",
    lineHeight: "10px",
    //padding: `0 64px 0 0`,
  }
}));

export default function MockWorkdayRecruiting() {
  const classes = useStyles();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
        <img src={talent_image} style={{ width: "98%", height: "98%", objectFit: "cover" }} />
      </Box>
    </Box>
  )
}
