import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

const RecordingProgress = ({ time }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, ml: 1 }}>
      <Typography variant="body2" sx={{ mr: 1 }}>
        {formatTime(time)}
      </Typography>
      <LinearProgress sx={{ flex: 1 }} />
      <Typography variant="body2" sx={{ ml: 1 }}>
        01:00
      </Typography>
    </Box>
  );
};

export default RecordingProgress;