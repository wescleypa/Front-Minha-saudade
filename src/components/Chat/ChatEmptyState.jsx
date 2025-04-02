'use client';

import { Typography, Box, Container, useMediaQuery, Link, Button, Collapse, Stack } from '@mui/material';
import { useSession } from '../../contexts/SessionContext';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';

export const ChatEmptyState = ({ setPage }) => {
  const { socket } = useSocket();
  const { user, setUser } = useSession();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState();
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const tempMessageId = Date.now();
    const newMessage = {
      sender: 'user',
      text: inputValue,
      removeContext: true,
      id: tempMessageId,
      timestamp: new Date().toISOString()
    };

    // Prepara o context corretamente (array vazio se for novo chat)
    const context = !messages || messages?.length <= 0
      ? [] // ⭐ Novo chat → array vazio
      : messages
        ?.filter(m => !m?.removeContext) || []; // Chat existente (ou array vazio se falhar)

    setMessages((prev) => [...prev, newMessage]);

    setLoading(true);

    socket.emit(
      'sendEmpty',
      { input: inputValue, context },
      (response) => {
        setLoading(false);

        if (response.status === 'success') {
          setMessages((prev) => [
            // Atualiza a mensagem existente (removeContext: false)
            ...prev.map(msg =>
              msg?.id === tempMessageId
                ? { ...msg, removeContext: false }
                : msg
            ),
            // Adiciona a resposta do bot (se existir)
            ...(response?.reply ? [{
              sender: 'bot',
              text: response.reply,
              timestamp: new Date().toISOString()
            }] : [])
          ]);
        } else {
          // Rollback em caso de erro
          setMessages((prev) => [
            ...prev,
            ...prev?.filter(msg => msg?.id !== tempMessageId)
          ]);
        }
      }
    );

    setInputValue('');
  };
  const openModalLogin = () => { };
  const handleCloseModalLogin = () => { };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflow: 'hidden',
      minHeight: '100vh'
    }}
    >

      <Collapse
        in={!user?.id}
        sx={{ position: 'absolute', right: 10, top: 10 }}
      >
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              px: 3
            }}
            onClick={() => setPage('login')}
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              px: 3,
              backgroundColor: 'primary.dark',
              '&:hover': {
                backgroundColor: '#38A169',
              }
            }}
            onClick={() => setPage('register')}
          >
            Registrar
          </Button>
        </Stack>
      </Collapse>

      {/* Área principal com scroll único */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: isMobile ? '60vh' : '70vh',
        minHeight: isMobile ? '60vh' : '70vh'
      }}
      >
        <Container maxWidth="lg" sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2
        }}>
          {messages.length === 0 ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
              height: '100%'
            }}>
              <Typography
                variant="h2"
                fontWeight={600}
                lineHeight="110%"
                sx={{
                  fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                  textAlign: 'center'
                }}
              >
                Qual nome da sua <span style={{ color: '#FA5858' }}>saudade</span> ?
              </Typography>

              <Typography color="text.secondary" sx={{ maxWidth: '600px', mb: 6, textAlign: 'center' }}>
                Pergunte qualquer coisa e nosso assistente inteligente irá responder.
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              width: isMobile ? '95%' : '80%',
              flexGrow: 1,
              maxHeight: '100%'
            }}>
              {messages?.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Input fixo (sempre visível) */}
      <Box sx={{
        width: '100%',
        zIndex: 2,
      }}>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSend={handleSendMessage}
            disabled={loading}
          />
        </Container>
      </Box >

      {/* Footer fixo */}
      <Box component="footer">
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
            © {new Date().getFullYear()} Chat Assistente. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box >
    </Box >
  );
};