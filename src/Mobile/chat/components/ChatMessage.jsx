import { Box } from '@mui/material';
import React from 'react';
import MessagesList from './MessagesList';

const ChatMessage = ({ chat, onRetry, onLike, onUnlike }) => {
  return (
    <Box sx={{ maxWidth: '100%', overflowY: 'auto', padding: 2 }}>
      {chat?.messages?.map((message, index) => (
        <Box key={index}>
          <MessagesList chat={chat} message={message} enableDots={!!message?.enableDots} onRetry={onRetry} onLike={onLike} onUnlike={onUnlike}/>
        </Box>
      ))}
    </Box>
  );
};

export default ChatMessage;