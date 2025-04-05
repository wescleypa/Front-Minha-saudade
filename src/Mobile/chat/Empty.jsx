import { Box, Container, Typography, Link } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import ContentEmpty from './components/ContentEmpty';
import ChatInput from './components/Input';
import ChatMessage from './components/ChatMessage';
import { useSocket } from '../../contexts/SocketContext';
import { calculateTypingTimeout } from './components/Utils';

const EmptyChat = ({ setOpenLoginModal }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [messageBuffer, setMessageBuffer] = useState([]);
  const bufferTimeoutRef = useRef(null);

  // Buffer
  useEffect(() => {
    if (messageBuffer.length > 0) {
      // Reinicia o timeout sempre que uma nova mensagem chega no buffer
      if (bufferTimeoutRef.current) {
        clearTimeout(bufferTimeoutRef.current);
      }

      bufferTimeoutRef.current = setTimeout(() => {
        // Concatena todas as mensagens do buffer
        const combinedMessage = messageBuffer.map(m => m.text).join(' ');
        sendBufferedMessage(combinedMessage);
        setMessageBuffer([]);
      }, 5000); // 5 segundos de espera

      return () => {
        if (bufferTimeoutRef.current) {
          clearTimeout(bufferTimeoutRef.current);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageBuffer]);


  const chat = {
    id: 1,
    messages: messages,
    name: 'Camila',
    avatar: window.location.origin + '/images/camila.webp',
  };

  const sendBufferedMessage = async (message) => {
    if (message?.trim() === '') return;

    const pairId = messageBuffer[0]?.id;

    await socket.emit('message:empty:send', {
      message,
      pairId
    }, (response) => {
      if (!response.success) {
        setMessages(prevMessages => prevMessages.map(msg =>
          msg.id === pairId ? { ...msg, error: true } : msg
        ));
      } else {
        if (response?.message) {
          handleAIResponse(response.message, pairId);
        }
      }
    });
  };

  const handleAIResponse = (message, pairId) => {
    const messageTyping = {
      id: `typing-${Date.now()}`,
      sender: 'assistant',
      enableDots: true,
      pairId
    };

    setMessages(prev => [...prev, messageTyping]);

    setTimeout(() => {
      setMessages(prevMessages => {
        return [
          ...prevMessages.filter(msg => msg.id !== messageTyping.id),
          {
            id: Date.now().toString(),
            text: message,
            sender: 'assistant',
            error: false,
            isTyping: false,
            time: new Date().toISOString(),
            pairId
          }
        ];
      });
    }, calculateTypingTimeout(message.length) / 1.5);
  };

  const handleSend = (message) => {
    if (typeof message !== 'string') {
      return setOpenLoginModal(true);
    }
    if (message?.trim() === '') return;

    const processedMessage = message.replace(/(^|\s)(\w)\s+(?=\w(\s|$))/g, '$1$2$3');
    const messageId = Date.now().toString();

    // Adiciona mensagem ao buffer com ID
    setMessageBuffer(prev => [...prev, {
      id: messageId,
      text: processedMessage,
      time: new Date().toISOString()
    }]);

    // Exibe mensagem temporária para o usuário
    setMessages(prev => [...prev, {
      id: messageId,
      text: message,
      sender: 'user',
      isTyping: true,
      isTemporary: true,
      time: new Date().toISOString()
    }]);
  };

  const onRetry = async (message) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages?.filter(msg => msg.id !== message.id);
      return updatedMessages;
    });

    await handleSend(message?.text);
  };

  const onLike = async (message) => {
    const pairMessage = messages.find(msg => msg.id === message.pairId);

    await socket.emit('message:empty:like', { user: pairMessage?.text, assistant: pairMessage?.text }, (response) => {
      if (!response.success) {
        setMessages(prevMessages => prevMessages.map(msg =>
          msg.id === message?.id ? { ...msg, errorLike: true } : msg
        ));
      } else {
        setMessages(prevMessages => prevMessages.map(msg =>
          msg.id === message?.id ? { ...msg, liked: true } : msg
        ));
      }
    });
  };

  const onUnlike = async (message) => {
    const pairMessage = messages.find(msg => msg.id === message.pairId);

    await socket.emit('message:empty:unlike', { user: pairMessage?.text, assistant: pairMessage?.text }, (response) => {
      if (!response.success) {
        setMessages(prevMessages => prevMessages.map(msg =>
          msg.id === message?.id ? { ...msg, errorUnlike: true } : msg
        ));
      } else {
        setMessages(prevMessages => prevMessages.map(msg =>
          msg.id === message?.id ? { ...msg, Unliked: true, liked: false } : msg
        ));
      }
    });
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%'
    }}>

      {/* Área principal centralizada */}
      {chat?.messages?.length <= 0 && (
        <>
          <Box sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            p: 2
          }}>
            <ContentEmpty />
          </Box>

          {/* Termos */}
          <Box component="footer" sx={{
            width: '100%',
            py: 2,
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 50
          }}>
            <Container maxWidth="lg">
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ fontSize: '0.75rem' }}
              >
                Ao usar este serviço, você concorda com nossos{' '}
                <Link href="#" color="inherit" underline="hover">Termos</Link> e{' '}
                <Link href="#" color="inherit" underline="hover">Privacidade</Link>.
                <br />
                © {new Date().getFullYear()} Minha saudade. Todos os direitos reservados.
              </Typography>
            </Container>
          </Box>
        </>
      )}

      {/* Conteúdo do chat */}
      <Box sx={{ maxWidth: '100%', overflowY: 'auto', pb: 5, pt: 8 }}>
        <ChatMessage chat={chat} onRetry={onRetry} onLike={onLike} onUnlike={onUnlike} />
      </Box>

      {/* ChatInput fixo na parte inferior */}
      <Box sx={{ width: '100%' }}>
        <ChatInput onSend={handleSend} />
      </Box>

    </Box>
  );
};

export default EmptyChat;