import React from 'react';
import EmojiPicker from './EmojiPicker';
import { IconButton } from '@mui/material';
import { Collections } from '@mui/icons-material';

const InputControls = ({
  onEmojiSelect,
  onFileUpload
}) => {

  return (
    <>
      <EmojiPicker onSend={onEmojiSelect} />

      <IconButton
        onClick={onFileUpload}
        aria-label="Enviar arquivo"
      >
        <Collections />
      </IconButton>
    </>
  );
};

export default InputControls;