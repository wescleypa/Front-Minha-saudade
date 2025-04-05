import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ChatIcon from '@mui/icons-material/Chat';
import { Alert, Button, Snackbar } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useSession } from '../../contexts/SessionContext';
import { Avatar } from '@mui/material';
import { Container } from '@mui/material';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useSocket } from '../../contexts/SocketContext';
import { Menu, MenuItem, ListItemAvatar } from '@mui/material';
import { MoreVert, Settings, Logout } from '@mui/icons-material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { Fab } from '@mui/material';
import { Tooltip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DrawerConfigure from './DrawerConfig/DrawerConfigure';

const drawerWidth = 240;

const menus = [
  {
    title: 'Main',
    items: [
      { text: 'Inbox', icon: <InboxIcon /> },
      { text: 'Starred', icon: <MailIcon /> },
      { text: 'Send email', icon: <InboxIcon /> },
      { text: 'Drafts', icon: <MailIcon /> }
    ]
  },
  {
    title: 'Secondary',
    items: [
      { text: 'All mail', icon: <InboxIcon /> },
      { text: 'Trash', icon: <MailIcon /> },
      { text: 'Spam', icon: <InboxIcon /> }
    ]
  }
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

const UserProfileSection = ({ setPage }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { user, logout } = useSession();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    setPage(null);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    setPage('profile');
  };

  return (
    <>
      <ListItem alignItems="flex-start" sx={{ px: 2, pb: 1 }}>
        <ListItemAvatar sx={{ minWidth: '48px' }}>
          <Avatar
            src={user?.pic}
            sx={{ width: 40, height: 40 }}
            onClick={handleClick}
          >
            {user?.name?.charAt(0)}
          </Avatar>
        </ListItemAvatar>

        <ListItemText
          primary={
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {user?.name}
            </Typography>
          }
          secondary={
            <Typography
              variant="body2"
              sx={{
                fontSize: 12,
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              color="text.secondary"
            >
              {user?.email}
            </Typography>
          }
          sx={{ my: 0 }}
        />

        <IconButton
          edge="end"
          aria-label="menu"
          onClick={handleClick}
          sx={{ ml: 'auto', alignSelf: 'center' }}
        >
          <MoreVert />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleProfile()}>
            <Settings sx={{ mr: 1 }} fontSize="small" /> Configurações
          </MenuItem>
          <MenuItem onClick={() => handleLogout()} >
            <Logout sx={{ mr: 1 }} fontSize="small" /> Sair
          </MenuItem>
        </Menu>
      </ListItem>
      <Divider sx={{ my: 1 }} />
    </>
  );
};


export default function DrawerChat({ setPage }) {
  const { socket } = useSocket();
  const { user, setUser } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const [selectedChat, setSelectedChat] = React.useState();
  const [resetInputMessage, setResetInputMessage] = React.useState(false);
  const [loading, setLoading] = React.useState({});
  const [openConfigChat, setOpenConfigChat] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [unviewedChats, setUnviewedChats] = React.useState({});
  const selectedChatRef = React.useRef(selectedChat);

  React.useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  React.useEffect(() => {
    if (user?.chats) {
      const unviewed = {};
      user.chats.forEach(chat => {
        if (!chat.viewed && chat.id !== selectedChatRef.current) {
          unviewed[chat.id] = true;
        }
      });
      setUnviewedChats(unviewed);
    }
  }, [user?.chats, selectedChat]);

  // Função para marcar chat como visualizado
  const markChatAsViewed = async (chatId) => {
    // Não marca como visto se já for o chat atual ou se for inválido
    if (!chatId || chatId === selectedChatRef.current) return;

    setUser(prev => ({
      ...prev,
      chats: prev.chats.map(chat =>
        chat.id === chatId
          ? { ...chat, viewed: true }
          : chat
      )
    }));

    await socket.emit('chat:viewed', { chatId }, (response) => {
      if (response?.status === 'success') {

        setUser(prev => ({
          ...prev,
          chats: prev.chats.map(chat =>
            chat.id === chatId
              ? { ...chat, viewed: true }
              : chat
          )
        }));
      } else {
        console.error('Falha ao marcar chat como visto:', response?.error);
      }
    });
  };

  React.useEffect(() => {
    // Verifica se o chat realmente mudou e não é nulo/undefined
    if (selectedChat && selectedChat !== selectedChatRef.current) {
      markChatAsViewed(selectedChat);
    }
  }, [selectedChat]);

  const calculateTypingTimeout = (textLength) => {
    // Constantes realistas:
    const CHARS_PER_SECOND = 6.0;  // ~360 chars/min (ritmo natural)
    const MIN_TIMEOUT = 1500;      // 1.5s mínimo (para "Oi", "Ok")
    const BASE_TIMEOUT = 8000;     // Tempo base para textos médios
    const LONG_TEXT_THRESHOLD = 500; // A partir de 500 chars, aplica escalonamento

    if (textLength <= LONG_TEXT_THRESHOLD) {
      // Cálculo normal para textos curtos/médios
      const baseTimeMs = (textLength / CHARS_PER_SECOND) * 1000;
      return Math.round(Math.max(baseTimeMs, MIN_TIMEOUT));
    } else {
      // Escalonamento para textos MUITO longos (ex.: seu Lorem Ipsum)
      const excessChars = textLength - LONG_TEXT_THRESHOLD;
      const extraTime = (excessChars / (CHARS_PER_SECOND * 2)) * 1000; // Diminui a velocidade
      return Math.round(BASE_TIMEOUT + extraTime);
    }
  };

  const sendMessage = async (value, isNewChat, targetChatId, tempMessageId) => {
    if (value.trim() === '') return;

    await socket.emit(
      'message:send',
      {
        chatID: targetChatId,
        input: value
      },
      (response) => {
        // Ativa o loading IMEDIATAMENTE ao receber a resposta
        setLoading(prev => ({ ...prev, [`chat${targetChatId}`]: true }));

        const handleResponseProcessing = () => {
          if (response.status === 'success') {
            const lengthMessage = response?.reply?.length || 0;
            const processingTime = calculateTypingTimeout(lengthMessage) / 2;

            // 1. Primeiro processa as atualizações do chat
            if (response?.tempChatID || response?.tempChatID === 0) {
              setUser(prev => ({
                ...prev,
                chats: prev.chats.map(chat =>
                  chat.id === response.tempChatID
                    ? {
                      ...chat,
                      id: response.permanentChatID,
                      isTemp: undefined,
                      name: response?.chatName ?? chat?.name
                    }
                    : chat
                )
              }));
              setLoading(prev => ({ ...prev, [`chat${targetChatId}`]: false }));
              setLoading(prev => ({ ...prev, [`chat${response?.permanentChatID}`]: true }));
              setSelectedChat(response.permanentChatID);
            }

            // 2. Atualizações adicionais do chat
            if (response?.chatName && !response?.tempChatID && response?.tempChatID !== 0) {
              setUser(prev => ({
                ...prev,
                chats: prev.chats.map(chat =>
                  chat.id === (response?.permanentChatID || targetChatId)
                    ? {
                      ...chat,
                      name: response?.chatName ?? chat?.name
                    }
                    : chat
                )
              }));
            }

            // 3. Atualiza as mensagens com delay calculado
            setTimeout(() => {
              setUser(prev => ({
                ...prev,
                chats: prev.chats.map(chat =>
                  chat.id === (response.permanentChatID || targetChatId)
                    ? {
                      ...chat,
                      messages: chat.messages
                        .map(msg =>
                          msg.tempId === tempMessageId
                            ? { ...msg, tempId: undefined, removeContext: false }
                            : msg
                        )
                        .concat(
                          response.reply
                            ? {
                              sender: 'assistant',
                              text: response.reply,
                              timestamp: new Date().toISOString()
                            }
                            : []
                        ),
                      viewed: chat.id === selectedChatRef.current
                    }
                    : chat
                )
              }));

              // DESATIVA O LOADING somente após exibir a mensagem
              setLoading(prev => ({ ...prev, [`chat${response?.permanentChatID}`]: false }));
            }, processingTime);
          } else {
            // Tratamento de erro
            if (response?.error?.toString()?.includes('expirada')) {
              setOpenError(response?.error);
            } else {
              setUser(prev => ({
                ...prev,
                chats: isNewChat
                  ? prev.chats?.filter(chat => chat.id !== targetChatId)
                  : prev.chats.map(chat =>
                    chat.id === targetChatId
                      ? {
                        ...chat,
                        messages: chat.messages.map(msg =>
                          msg.tempId === tempMessageId
                            ? { ...msg, error: true, errorMessage: response?.error || "Erro ao enviar" }
                            : msg
                        )
                      }
                      : chat
                  )
              }));
            }
            setLoading(prev => ({ ...prev, [`chat${response?.permanentChatID}`]: false }));
          }
        };

        // Processa a resposta imediatamente (mas o loading continua até o timeout)
        handleResponseProcessing();
      }
    );

  };


  const messagesBuffer = React.useRef({});
  const typingTimeouts = React.useRef({});

  const handleSendMessage = React.useCallback(async (value) => {
    const isNewChat = selectedChat === null || selectedChat === undefined;
    const targetChatId = (selectedChat === null || selectedChat === undefined)
      ? user?.chats?.length || 0 : selectedChat;

    // 1. Atualiza a UI imediatamente com mensagem temporária
    const tempMessageId = Date.now();
    const newMessage = {
      sender: 'user',
      text: value,
      removeContext: true,
      tempId: tempMessageId,
      timestamp: new Date().toISOString()
    };

    setUser(prev => {
      const newChat = {
        id: targetChatId,
        avatar: null,
        name: 'Pessoa desconhecida',
        messages: [newMessage]
      };

      return isNewChat
        ? { ...prev, chats: [...(prev.chats || []), newChat] }
        : {
          ...prev,
          chats: prev.chats.map(chat =>
            chat.id === targetChatId
              ? { ...chat, messages: [...chat.messages, newMessage] }
              : chat
          )
        };
    });

    if (isNewChat) {
      setSelectedChat(targetChatId);
    }

    setResetInputMessage(true);

    // 2. Sistema de buffer para agrupamento
    if (!messagesBuffer.current[targetChatId]) {
      messagesBuffer.current[targetChatId] = [];
    }

    if (typingTimeouts.current[targetChatId]) {
      clearTimeout(typingTimeouts.current[targetChatId]);
    }

    messagesBuffer.current[targetChatId].push(value);

    typingTimeouts.current[targetChatId] = setTimeout(async () => {
      const fullMessage = messagesBuffer.current[targetChatId].join(' ');
      messagesBuffer.current[targetChatId] = [];

      try {
        await sendMessage(fullMessage, isNewChat, targetChatId, tempMessageId);
      } catch (error) {
        console.error("Failed to send message:", error);
        // Reverter a mensagem temporária em caso de erro
        setUser(prev => ({
          ...prev,
          chats: prev.chats.map(chat =>
            chat.id === targetChatId
              ? {
                ...chat,
                messages: chat.messages.filter(msg => msg.tempId !== tempMessageId)
              }
              : chat
          )
        }));
      }

      delete typingTimeouts.current[targetChatId];
    }, 3000);
  }, [selectedChat, user?.chats?.length]);

  const handleRetryMessage = (message) => {
    // Primeiro remove a mensagem com erro
    setUser(prev => ({
      ...prev,
      chats: prev.chats.map(chat =>
        chat.id === selectedChat
          ? {
            ...chat,
            messages: chat.messages.filter(msg =>
              !(msg.id === message.id || msg.tempId === message.tempId)
            )
          }
          : chat
      )
    }));

    // Depois envia novamente
    handleSendMessage(message.text);
  };

  const renderMenuItems = (item) => {
    const hasUnread = !item.viewed && item.id !== selectedChatRef.current;

    return (
      <ListItem
        key={item?.name}
        disablePadding
        sx={{ display: 'block' }}
        onClick={() => {
          setSelectedChat(item?.id);
          markChatAsViewed(item.id);
        }}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            px: 2.5,
            justifyContent: desktopOpen ? 'initial' : 'center',
            position: 'relative'
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              justifyContent: 'center',
              mr: desktopOpen ? 1 : 'auto'
            }}
          >
            <Avatar
              sx={{ width: 30, height: 30 }}
              src={`${process.env.REACT_APP_API_URL}/chat/pic?token=${user?.token}&user=${item?.id}`}
              alt={item?.name}
            >
              {item?.name.charAt(0)}
            </Avatar>
          </ListItemIcon>
          <ListItemText
            sx={{
              display: desktopOpen || mobileOpen ? 'block' : 'none',
              fontWeight: hasUnread ? 'bold' : 'normal'
            }}
            primary={item?.name}
          />

          {hasUnread && (
            <Box
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'primary.main'
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  React.useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [user?.chats, selectedChat]);

  const handleCloseSuccess = () => setOpenSuccess(null);
  const handleCloseError = () => setOpenError(null);

  const updateChatConfig = async (chatID, column, value) => {
    const backup = user?.chats[column];

    if (user?.chats?.find(c => c?.id === chatID)[column] !== value) {
      setUser(prev => ({
        ...prev,
        chats: prev.chats.map(chat =>
          chat.id === chatID
            ? {
              ...chat,
              [column]: value
            }
            : chat
        )
      }));

      var chatUpdate = user?.chats?.find(c => c?.id === chatID);
      chatUpdate[column] = value;
      await socket.emit('chat:update',
        { chatID, column, value, user, chat: chatUpdate },
        (response) => {
          if (response?.status === 'success') {
            setOpenSuccess('Atualização configurada');
          } else {
            setUser(prev => ({
              ...prev,
              chats: prev.chats.map(chat =>
                chat.id === chatID
                  ? {
                    ...chat,
                    [column]: backup
                  }
                  : chat
              )
            }));
            setOpenError(response?.error ?? 'Falha ao atualizar, tente novamente');
          }
        });

    }

  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <DrawerConfigure open={openConfigChat} setOpen={setOpenConfigChat} camila={selectedChat} update={updateChatConfig} />
      <Snackbar
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        autoHideDuration={5000}
        open={openSuccess}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {openSuccess}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        autoHideDuration={5000}
        open={openError}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {openError}
        </Alert>
      </Snackbar>

      {!!user?.id && (
        <AppBar
          position="fixed"
          open={desktopOpen && !isMobile}
          sx={{
            bgcolor: 'transparent',
            color: 'rgba(0,0,0,0.7)',
            width: 'auto',
            left: '50%',
            top: 0,
            transform: desktopOpen && !isMobile && !!user?.id ? 'translateX(-30%)' : 'translateX(-50%)',
            maxWidth: '80%',
            borderRadius: '0 0 10px 10px',
            //boxShadow: '0px 4px 2px -2px rgba(0,0,0,0.1)',
            boxShadow: '0',
            margin: '0 auto',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Toolbar sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h7" noWrap component="div">
              {
                selectedChat !== undefined && selectedChat !== null && (
                  user?.chats?.find(c => c?.id === selectedChat)?.name
                    ? `Conversa com ${user?.chats?.find(c => c?.id === selectedChat)?.name}`
                    : 'Chat não encontrado'
                )
              }
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer para desktop */}
      {!isMobile && !!user?.id && (
        <Drawer variant="permanent" open={desktopOpen}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerToggle}>
              {desktopOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>

          <List>
            <UserProfileSection setPage={setPage} />
          </List>

          <List sx={{ p: 2, display: desktopOpen || mobileOpen ? 'block' : 'none' }}>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => setSelectedChat(null)}
            >
              <ChatIcon />&nbsp;Nova conversa
            </Button>
          </List>

          <Box sx={{ overflow: 'auto' }}>
            {user?.chats && Array.isArray(user?.chats) && [...user.chats]
              .sort((a, b) => b.id - a.id) // Ordena por ID decrescente
              .map((item, index) => (
                <React.Fragment key={item?.id}>
                  <List>
                    {renderMenuItems(item)}
                  </List>
                </React.Fragment>
              ))}
          </Box>
        </Drawer>
      )}

      {/* Drawer para mobile */}
      {isMobile && !!user?.id && (
        <MuiDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Melhora performance no mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerToggle}>
              {mobileOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          {menus.map((menu, index) => (
            <React.Fragment key={menu.title}>
              <List>
                {menu.items.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              {index < menus.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </MuiDrawer>
      )}

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
        minHeight: { sm: '96vh', xs: '95vh' }
      }}
      >
        <Box component="main" sx={{ flexGrow: 1 }}>

          {/* Área principal com scroll único se tiver um chat selecionado */}
          {selectedChat !== undefined && selectedChat !== null && (
            <Box
              id="messages-container"
              sx={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: isMobile ? '60vh' : '70vh',
                minHeight: isMobile ? '60vh' : '70vh',
              }}
            >
              <Container maxWidth="lg" sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 2
              }}>
                {user?.chats?.find(chat => chat?.id === selectedChat)?.messages?.length === 0 ? (
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
                  <Box
                    sx={{
                      width: isMobile ? '95%' : '80%',
                      flexGrow: 1,
                      maxHeight: '100%',
                      overflow: 'hidden'
                    }}>
                    {user?.chats?.find(chat => chat.id === selectedChat)?.messages?.map((message, index) => (
                      <div key={index}>
                        <ChatMessage
                          key={index}
                          message={message}
                          chat={user?.chats?.find(chat => chat.id === selectedChat) || []}
                          avatar={`${process.env.REACT_APP_API_URL}/chat/pic?token=${user?.token}&user=${selectedChat}`}
                          onRetry={(text) => handleRetryMessage(text)}
                        />
                      </div>
                    ))}

                    {!!loading[`chat${selectedChat}`] && (
                      <ChatMessage message={{
                        id: null,
                        sender: 'assistant',
                        text: 'Está digitando',
                        timestamp: new Date().toISOString()
                      }} chat={user?.chats?.find(chat => chat.id === selectedChat) || []} enableDots={true} onRetry={(text) => handleRetryMessage(text)} />
                    )}

                    {!loading[`chat${selectedChat}`] && (
                      <Tooltip
                        title="Personalize informações da sua saudade para inteligência incorporar melhor o personagem."
                      >
                        <Fab
                          variant={isMobile ? 'circular' : 'extended'}
                          sx={{
                            position: 'fixed',
                            bottom: 140,
                            left: '50%',
                            transform: desktopOpen && !isMobile ? '' : 'translateX(-30%)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: 'primary.dark',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'grey'
                            }
                          }}
                          onClick={() => setOpenConfigChat(true)}
                        >
                          <AutoAwesomeIcon sx={{ mr: 1 }} />
                          {!isMobile && (<>Aprimorar</>)}
                        </Fab>
                      </Tooltip>
                    )}

                  </Box>
                )}
              </Container>
            </Box>
          )}

          {(selectedChat === undefined || selectedChat === null) && (
            <>
              <Box
                id="messages-container"
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: isMobile ? '60vh' : '70vh',
                  minHeight: isMobile ? '60vh' : '70vh',
                }}
              >
                <Container maxWidth="lg" sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 2
                }}>
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
                </Container>
              </Box>
            </>
          )}
        </Box>

        {/* Input fixo (sempre visível) */}
        <Box sx={{
          width: '100%',
          zIndex: 2
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
              resetInput={resetInputMessage}
              resetedInput={(e) => setResetInputMessage(!e)}
              onSend={handleSendMessage}
            //disabled={!!loading[`chat${selectedChat}`]}
            />
          </Container>
        </Box>

      </Box>
    </Box>
  );
}