'use client';

import React, { useEffect, useState } from 'react';
import {
  Box, Container, Stack, Toolbar, Button, Typography, Link, Modal, Divider,
  Snackbar, Alert, Collapse, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Avatar, IconButton, useMediaQuery
} from '@mui/material';
import { ChatInput, ChatMessage, ChatEmptyState } from './components/Chat';
import { useSocket } from './contexts/SocketContext';
import { useSession } from './contexts/SessionContext';
import {
  AppRegistration, Login, Logout, Person, Menu, Close
} from '@mui/icons-material';

const styleLoginModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 380,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
  p: 4,
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2
};

const drawerWidth = 240;

export default function ChatUI({ setPage }) {
  const { user, error, setError, logout, setUser } = useSession();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModalLogin, setOpenModalLogin] = useState(user?.id ? false : true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (user?.id) {
      setOpenModalLogin(false);
    }
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    if (messages?.length <= 0) {
      setUser((prev) => ({
        ...prev,
        chats: Array.isArray(prev?.chats)
          ? [...prev.chats, { id: prev?.chats?.length, avatar: null, name: 'Pessoa desconhecida' }]
          : [{ id: 0, avatar: null, name: 'Pessoa desconhecida' }]
      }));
    }
    const index = Array.isArray(user?.chats) ? user?.chats?.length : 0;
    const newChat = messages?.length <= 0;
    const chatID = selectedChat ?? index;

    if (chatID === selectedChat) {
      setMessages(prev => [...prev, { text: inputValue, sender: 'user' }]);
    }
    setUser(prev => ({
      ...prev,
      chats: prev?.chats?.map(chat =>
        chat?.id === chatID
          ? {
            ...chat,
            messages: [
              ...(chat?.messages || []),
              {
                text: inputValue,
                sender: 'user'
              }
            ]
          }
          : chat
      )
    }));
    setInputValue('');
    setLoading(true);

    socket.emit(
      'send',
      { input: inputValue, context: messages, token: user?.token, chatID },
      (response) => {
        console.log(response);
        if (response.status === 'success') {
          if (!!newChat) {
            setUser(prev => ({
              ...prev,
              chats: prev.chats?.map(chat =>
                chat.id === index ? { ...chat, id: response.chatID } : chat
              )
            }));
          }

          setUser(prev => ({
            ...prev,
            chats: prev?.chats?.map(chat =>
              chat?.id === chatID
                ? {
                  ...chat,
                  messages: [
                    ...(chat?.messages || []),
                    {
                      text: response?.response,
                      sender: 'assistant'
                    }
                  ]
                }
                : chat
            )
          }));
          if (chatID === selectedChat) {
            setMessages(prev => [...prev, { text: response?.response, sender: 'assistent' }]);
          }
        } else {
          console.error('Falha ao enviar mensagem:', response.error);
        }
        setLoading(false);
      }
    );
  };

  const handleCloseModalLogin = () => setOpenModalLogin(false);

  const goPage = (page) => {
    setOpenModalLogin(false);
    setMobileOpen(false);
    setPage(page);
  };

  const handleCloseAlert = () => setError();

  const selectChat = (id) => {
    const selChat = user?.chats?.find(chat => chat.id === id);
    setMessages(selChat?.messages || []);
    setSelectedChat(id);
  };
  const drawerContent = (
    <>
      <Box sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        justifyContent: isMobile ? 'space-between' : 'flex-start'
      }}>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer'
          }}
          onClick={() => setPage('profile')}
        >
          {isMobile && (
            <Typography variant="body2" sx={{ fontSize: 14, textAlign: 'right' }} fontWeight={600}>
              {user?.name || 'Usuário'}
            </Typography>
          )}

          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {user?.name ? user?.name.charAt(0).toUpperCase() : <Person />}
          </Avatar>
          {!isMobile && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.name || 'Usuário'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {!isMobile && (
        <Button onClick={() => setPage('profile')}>
          Acessar perfil
        </Button>
      )}

      <Divider sx={{ my: 1 }} />

      <List>
        {user?.chats && user?.chats?.map((chat, index) => (
          <ListItem disablePadding key={index} onClick={() => selectChat(chat?.id)}>
            <ListItemButton sx={{ gap: 1 }}>
              <Avatar sx={{ width: 30, height: 30 }}>{chat?.avatar ?? chat?.id}</Avatar>
              <ListItemText primary={<Typography variant="body2">{chat?.name}</Typography>} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ my: 1 }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <Logout color="error" />
              </ListItemIcon>
              <ListItemText primary="Sair" primaryTypographyProps={{ color: 'error' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </>
  );

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Drawer para desktop (permanente) */}
      {user?.id && !isMobile && (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 'none',
              backgroundColor: 'background.paper'
            },
          }}
          variant="permanent"
          anchor="left"
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Drawer para mobile (temporário) */}
      {user?.id && isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: 'background.paper'
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Conteúdo principal */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
        position: user?.id ? 'relative' : ''
      }}>
        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>

        {/* Header fixo */}
        <Toolbar sx={{
          justifyContent: user?.id && isMobile ? 'space-between' : 'flex-end',
          px: 2
        }}>
          {user?.id && isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <Menu />
            </IconButton>
          )}

          <Collapse in={!user?.id}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: 3
                }}
                onClick={() => goPage('login')}
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
                onClick={() => goPage('register')}
              >
                Registrar
              </Button>
            </Stack>
          </Collapse>
        </Toolbar>

        {/* Área principal com scroll único */}
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Container maxWidth="lg" sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 2,
            pb: 10
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
                <ChatEmptyState />
              </Box>
            ) : (
              <Box sx={{
                width: isMobile ? '95%' : '80%',
                flexGrow: 1,
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
          py: 2,
          position: 'absolute',
          bottom: { xs: 100, md: 80 },
          zIndex: 2,
          height: '20%',
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
        </Box>

        {/* Footer fixo */}
        <Box
          component="footer"
          sx={{
            py: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            flexShrink: 0
          }}
        >
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
        </Box>

        <Modal
          open={openModalLogin}
          onClose={handleCloseModalLogin}
          aria-labelledby="login-modal-title"
        >
          <Box sx={styleLoginModal}>
            {/* Logo/Cabeçalho */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={600} color="primary">
                Minha Saudade
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Conecte-se para aproveitar todas funcionalidades
              </Typography>
            </Box>

            {/* Botão de Login */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                borderRadius: '8px',
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
              onClick={() => goPage('register')}
            >
              <AppRegistration sx={{ mr: 1.5 }} />
              Cadastre-se grátis
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              sx={{
                borderRadius: '8px',
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                borderColor: 'divider',
                color: 'text.primary'
              }}
              onClick={() => goPage('login')}
            >
              <Login sx={{ mr: 1.5 }} />
              Acesse sua conta
            </Button>

            {/* Divisor */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              my: 2
            }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                ou
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            {/* Opção de continuar sem login */}
            <Button
              fullWidth
              variant="text"
              sx={{
                textTransform: 'none',
                color: 'primary.main',
                fontWeight: 500
              }}
              onClick={handleCloseModalLogin}
            >
              Continuar sem login
            </Button>

            {/* Termos de serviço */}
            <Typography variant="caption" color="text.secondary" sx={{
              mt: 3,
              textAlign: 'center',
              lineHeight: 1.4
            }}>
              Ao continuar, você concorda com nossos{' '}
              <Link href="#" underline="hover">Termos de Serviço</Link> e{' '}
              <Link href="#" underline="hover">Política de Privacidade</Link>.
            </Typography>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}