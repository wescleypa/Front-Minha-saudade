'use client';

import { Box, Avatar, Typography, styled, keyframes } from '@mui/material';
import React, { useEffect } from 'react';
import { useSession } from '../../contexts/SessionContext';

const ThoughtBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCurrentUser'
})(({ theme, isCurrentUser }) => ({
  position: 'relative',
  maxWidth: '70%',
  padding: theme.spacing(1.5),
  borderRadius: '18px',
  backgroundColor: isCurrentUser
    ? theme.palette.primary.main
    : theme.palette.grey[300],
  color: isCurrentUser ? '#fff' : theme.palette.text.primary,
  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
  margin: '8px 0',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: 0,
    [isCurrentUser ? 'right' : 'left']: '-8px',
    top: '12px',
    borderStyle: 'solid',
    borderWidth: '8px 12px 8px 0',
    borderColor: `transparent ${isCurrentUser
      ? theme.palette.primary.main
      : theme.palette.grey[300]
      } transparent transparent`,
    transform: isCurrentUser ? 'rotate(180deg)' : 'none'
  }
}));

const typingDots = keyframes`
  0%, 20% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const TypingDots = () => {
  return (
    <Box display="flex" gap={0.5}>
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          width={8}
          height={8}
          borderRadius="50%"
          bgcolor="text.primary"
          sx={{
            animation: `${typingDots} 1.5s infinite`,
            animationDelay: `${i * 0.3}s`, // Delay para cada ponto
          }}
        />
      ))}
    </Box>
  );
};

export const ChatMessage = ({ message, chat, enableDots = null }) => {
  const { user } = useSession();
  const [chatAvatar, setChatAvatar] = React.useState(
    chat?.avatar ?? window.location.origin + '/images/camila.webp'
  );

  useEffect(() => {
    if (user) {
      const chatUpdated = user?.chats?.find(c => c?.id === chat?.id);
   
      if (chatUpdated?.avatar !== chat?.avatar) {
        setChatAvatar(chatUpdated?.avatar);
      }

      if (!chatUpdated?.avatar || chatUpdated?.avatar === '') {
        setChatAvatar(window.location.origin + '/images/camila.webp');
      }
    }
  }, [user, chat?.id]);

  function formatMessageDate(dateString) {

    const date = new Date(dateString);
    const now = new Date();

    // Configura para comparar apenas datas (ignorando horas)
    const today = new Date(now.setHours(0, 0, 0, 0));
    const messageDate = new Date(date.setHours(0, 0, 0, 0));

    // Calcula diferença em dias
    const diffDays = Math.round((today - messageDate) / (1000 * 60 * 60 * 24));

    // Formata a hora (sempre HH:mm)
    const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const timeStr = timeFormatter.format(new Date(dateString));

    // Lógica de exibição
    if (diffDays === 0) {
      return timeStr; // Hoje - só mostra a hora
    } else if (diffDays === 1) {
      return `Ontem às ${timeStr}`;
    } else if (diffDays === 2) {
      return `Anteontem às ${timeStr}`;
    } else {
      // Formata data + hora para mensagens mais antigas
      const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      return dateFormatter.format(new Date(dateString))
        .replace(',', ' às') // Formata "31/03, 22:44" → "31/03 às 22:44"
        .replace(/(\d{2})\/(\d{2})/, '$1/$2'); // Remove ano se existir
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        mb: 2,
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
      }}
    >
      {message.sender === 'assistant' && (
        <Avatar
          sx={{ bgcolor: 'primary.dark', mr: 1 }}
          src={chatAvatar}
        />
      )}

      <ThoughtBubble isCurrentUser={message?.sender === 'user'}>
        <Typography
          variant="body1"
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {message?.text}&nbsp;{!!enableDots && (<TypingDots />)}
        </Typography>
        {!enableDots && (
          <Typography
            variant="caption"
            display="block"
            textAlign="right"
            sx={{ opacity: 0.7 }}
          >
            {formatMessageDate(message?.timestamp) || message?.timestamp}
          </Typography>
        )}
      </ThoughtBubble>

    </Box>
  );
};