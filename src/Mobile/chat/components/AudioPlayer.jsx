import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { PlayArrow, Pause, Cancel } from '@mui/icons-material';

const AudioPlayer = ({ audioBlob, recordingTime, onCancel }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setIsPlaying(false);
    
    if (audio) {
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.pause();
        audio.removeEventListener('ended', handleEnded);
        URL.revokeObjectURL(audio.src);
      };
    }
  }, [audioBlob]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!audioRef.current.src) {
        audioRef.current.src = URL.createObjectURL(audioBlob);
      }
      await audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 1 }}>
      <IconButton onClick={togglePlay} size="small" color={isPlaying ? 'primary' : 'default'}>
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
      
      <Typography variant="body2">
        Áudio gravado ({formatTime(recordingTime)})
      </Typography>
      
      <IconButton onClick={onCancel} size="small" sx={{ ml: 'auto' }} color="error">
        <Cancel />
      </IconButton>
      
      <audio ref={audioRef} hidden />
    </Box>
  );
};

export default AudioPlayer;