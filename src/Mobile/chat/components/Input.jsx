import React, { useState, useRef, useCallback } from 'react';
import { Box, BottomNavigation, InputBase, Divider } from '@mui/material';
import useAudioRecorder from './AudioRecorder';
import AudioPlayer from './AudioPlayer';
import RecordingProgress from './RecordingProgress';
import EmojiPicker from './EmojiPicker';
import SubmitButton from './SubmitButton';

const ChatInput = ({ onSend }) => {
  const [value, setValue] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const inputRef = useRef(null);
  const { isRecording, recordingTime, startRecording, stopRecording } = useAudioRecorder();


  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRecording) {
      try {
        const blob = await stopRecording();
        setAudioBlob(blob);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
      return;
    }

    if (audioBlob) {
      onSend(audioBlob);
      setAudioBlob(null);
      return;
    }

    if (value.trim()) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <BottomNavigation sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        bgcolor: 'background.paper',
        boxShadow: 3
      }}>
        <EmojiPicker onSend={(emoji) => {
          setValue(v => v + emoji);
          inputRef.current?.focus();
        }}
        />
        {isRecording ? (
          <RecordingProgress time={recordingTime} />
        ) : audioBlob ? (
          <AudioPlayer
            audioBlob={audioBlob}
            recordingTime={recordingTime}
            onCancel={() => setAudioBlob(null)}
          />
        ) : (
          <InputBase
            inputRef={inputRef}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Digite uma mensagem..."
            value={value}
            onChange={handleChange}
            fullWidth
          />
        )}

        <Divider sx={{ height: 28, m: 1 }} orientation="vertical" />

        <SubmitButton
          isRecording={isRecording}
          hasAudio={!!audioBlob}
          hasText={!!value.trim()}
          onStartRecording={startRecording}
        />
      </Box>
    </BottomNavigation>
  );
};

export default ChatInput;