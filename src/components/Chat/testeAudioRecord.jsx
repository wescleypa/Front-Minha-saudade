import React, { useState, useRef, useEffect } from 'react';
import { 
  Button,
  IconButton,
  LinearProgress,
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Slider
} from '@mui/material';
import {
  Mic as MicIcon,
  Stop as StopIcon,
  Send as SendIcon,
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon
} from '@mui/icons-material';

const AudioRecorder = ({ onSend, maxDuration = 30 }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioLevels, setAudioLevels] = useState(Array(10).fill(5));
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);

  // Inicia a gravação com análise de áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      microphone.connect(analyser);
      analyser.fftSize = 32;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      microphoneRef.current = microphone;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/mp3' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prev + 0.1;
        });

        if (analyser) {
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);
          const levels = Array.from(dataArray)
            .filter((_, i) => i % 3 === 0) // Reduz a quantidade de barras
            .map(val => Math.min(100, Math.max(5, val / 2.5))); // Normaliza os valores
          setAudioLevels(levels);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
      if (microphoneRef.current && analyserRef.current) {
        microphoneRef.current.disconnect(analyserRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const sendAudio = () => {
    if (audioBlob && onSend) {
      onSend(audioBlob);
      setAudioBlob(null);
      setAudioUrl('');
      setRecordingTime(0);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Paper elevation={3} sx={{ p: 2, width: '100%', maxWidth: 400 }}>
      {!isRecording ? (
        <>
          {!audioUrl ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<MicIcon />}
              onClick={startRecording}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Gravar Áudio
            </Button>
          ) : (
            <Box>
              <audio
                src={audioUrl}
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                hidden
              />
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <IconButton color="primary" onClick={togglePlayback}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </IconButton>
                </Grid>
                <Grid item xs>
                  <Slider
                    value={0}
                    sx={{
                      '& .MuiSlider-thumb': {
                        display: 'none'
                      }
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="caption">
                    {formatTime(audioRef.current?.duration || 0)}
                  </Typography>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={1} justifyContent="flex-end" mt={1}>
                <IconButton color="error" onClick={() => setAudioUrl('')}>
                  <CloseIcon />
                </IconButton>
                <IconButton color="success" onClick={sendAudio}>
                  <SendIcon />
                </IconButton>
              </Stack>
            </Box>
          )}
        </>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {audioLevels.map((level, i) => (
              <Box
                key={i}
                sx={{
                  width: 4,
                  height: level,
                  bgcolor: 'primary.main',
                  mx: 0.5,
                  borderRadius: 2,
                  transition: 'height 0.1s'
                }}
              />
            ))}
          </Box>
          <LinearProgress
            variant="determinate"
            value={(recordingTime / maxDuration) * 100}
            sx={{ height: 6, mb: 1 }}
          />
          <Typography variant="caption" display="block" textAlign="center">
            {formatTime(recordingTime)} / {formatTime(maxDuration)}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <IconButton
              color="error"
              onClick={stopRecording}
              sx={{ bgcolor: 'error.main', color: 'white' }}
            >
              <StopIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default AudioRecorder;