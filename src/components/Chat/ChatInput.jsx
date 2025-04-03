'use client';

import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useEffect, useState } from 'react';

export const ChatInput = ({ resetInput, resetedInput, onSend, disabled }) => {
  const [value, setValue] = useState();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
    }
  };

  useEffect(() => {
    if (resetInput) {
      resetedInput(true);
      setValue('');
    }
  }, [resetInput]);

  const handleChange = (e) => setValue(e?.target?.value);

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSend(value);
      }}
      sx={{
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 2,
        p: 1,
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        mb: 4,
        mt: '50px !important',
      }}
    >
      <IconButton color="primary" aria-label="upload file" disabled={disabled}>
        <AttachFileIcon />
      </IconButton>

      <TextField
        fullWidth
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        variant="outlined"
        placeholder="Digite sua mensagem..."
        multiline
        maxRows={4}
        sx={{
          mx: 1,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': { borderColor: 'transparent' },
            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
          },
        }}
      />

      <IconButton
        color="primary.dark"
        aria-label="send"
        type="submit"
        sx={{
          backgroundColor: 'primary.dark',
          color: 'white',
          '&:hover': { backgroundColor: '#38A169' }
        }}
        disabled={disabled}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};