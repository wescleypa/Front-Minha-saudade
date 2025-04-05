import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  styled,
  Button,
  Divider,
  Popover,
  TextField,
  CircularProgress,
  IconButton,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSocket } from '../../../contexts/SocketContext';

const ThoughtBubble = styled(Box)(({ theme, isCurrentUser }) => ({
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

export default function ChatTrain({ camila }) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Clique para editar essa mensagem...',
      pairId: 1 // ID do par de mensagens
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [pendingPair, setPendingPair] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const messageRefs = useRef({});
  const messagesEndRef = useRef(null);
  const currentMessageId = useRef(1);
  const currentPairId = useRef(1);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, saveError]);

  const handleEditMessage = (msgId, text, event) => {
    if (isSaving) return;

    setEditingId(msgId);
    const isPlaceholder = text.startsWith('Clique para editar') ||
      text.startsWith('Clique aqui para adicionar');
    setInputValue(isPlaceholder ? '' : text);
    setAnchorEl(event.currentTarget);
    setErrorInput('');
  };

  const handleOpenMenu = (message, event) => {
    setSelectedMessage(message);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleDeletePair = () => {
    if (!selectedMessage) return;

    const pairId = selectedMessage.pairId;
    const newMessages = messages.filter(msg => msg.pairId !== pairId);
    setMessages(newMessages);
    handleCloseMenu();

    // TODO: Implementar exclusão no backend
    // socket.emit('chat:train:delete', { pairId });
  };

  const sendToBackend = async (pair, isUpdate = false) => {
    setIsSaving(true);
    setSaveError(null);
    setPendingPair(pair);

    try {
      // Simulação de chamada socket (substitua pelo seu código real)
      const response = await new Promise((resolve) => {
        if (!socket) {
          // Simula um erro se não houver socket
          setTimeout(() => resolve(false), 1000);
          return;
        }

        const eventName = isUpdate ? 'chat:train:update' : 'chat:train:save';
        socket.emit(eventName, { chatID: camila, ...pair }, (response) => {
          if (response)
            resolve(response);
        });

        // Simulação (80% de chance de sucesso)
        setTimeout(() => resolve(Math.random() > 0.2), 1000);
      });

      if (response?.success) {
        setMessages(prev => {
          if (!response?.tempID || !response?.permanentID) {
            console.error('IDs de resposta inválidos:', response);
            return prev;
          }

          return prev.map(msg => ({
            ...msg,
            id: msg.id === response.tempID ? response.permanentID : msg.id,
            pairId: msg.pairId === response.tempID ? response.permanentID : msg.pairId
          }));
        });

        setTimeout(() => {
          console.log(messages)
        }, 5000);
        // Sucesso - continua o fluxo
        setPendingPair(null);
        if (!isUpdate) {
          addNewUserMessage();
        }
      } else {
        throw new Error(isUpdate
          ? 'Falha ao atualizar treinamento, tente novamente'
          : 'Falha ao salvar treinamento, tente novamente');
      }
    } catch (error) {
      setSaveError(error.message || 'Operação falhou, tente novamente');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetry = () => {
    if (pendingPair) {
      const isUpdate = messages.some(msg =>
        msg.pairId === pendingPair.pairId &&
        (msg.sender === 'user' || msg.sender === 'assistant')
      );
      sendToBackend(pendingPair, isUpdate);
    }
  };

  const addNewUserMessage = () => {
    const newMsgId = currentMessageId.current + 1;
    const newPairId = currentPairId.current + 1;
    const newMessage = {
      id: newMsgId,
      sender: 'user',
      text: 'Clique aqui para adicionar uma nova mensagem de treinamento',
      pairId: newPairId
    };
    setMessages(prev => [...prev, newMessage]);
    currentMessageId.current = newMsgId;
    currentPairId.current = newPairId;
    setAnchorEl(null);
  };

  const handleSave = () => {
    if (!inputValue.trim()) {
      return setErrorInput('Preencha o campo!');
    }

    const messageBeingEdited = messages.find(m => m.id === editingId);
    const isNewMessage = !messageBeingEdited ||
      messageBeingEdited.text.startsWith('Clique para editar') ||
      messageBeingEdited.text.startsWith('Clique aqui para adicionar');

    // Atualiza a mensagem atual
    const updatedMessages = messages.map(msg =>
      msg.id === editingId ? { ...msg, text: inputValue } : msg
    );
    setMessages(updatedMessages);

    const currentMessage = updatedMessages.find(m => m.id === editingId);
    const isLastMessage = editingId === updatedMessages[updatedMessages.length - 1].id;

    if (currentMessage?.sender === 'user' && isLastMessage) {
      // Adiciona nova mensagem da IA
      const newMsgId = currentMessageId.current + 1;
      const newMessage = {
        id: newMsgId,
        sender: 'assistant',
        text: 'Clique para editar a resposta da IA...',
        pairId: currentMessage.pairId
      };

      setMessages(prev => [...prev, newMessage]);
      currentMessageId.current = newMsgId;

      // Fecha e reabre o popover na nova mensagem
      setAnchorEl(null);
      setTimeout(() => {
        setEditingId(newMsgId);
        setInputValue('');
        setAnchorEl(messageRefs.current[newMsgId]);
      }, 50);
    }
    else if (currentMessage?.sender === 'assistant' && isLastMessage) {
      // Fecha o popover e prepara para enviar ao backend
      setAnchorEl(null);

      const userMessage = updatedMessages.find(msg =>
        msg.pairId === currentMessage.pairId && msg.sender === 'user'
      );

      const trainingPair = {
        pairId: currentMessage.pairId,
        userMessage: userMessage.text,
        assistantMessage: inputValue,
        isUpdate: !isNewMessage
      };

      sendToBackend(trainingPair, !isNewMessage);
    } else {
      // Para mensagens no meio do fluxo (atualização)
      setAnchorEl(null);

      if (currentMessage?.sender === 'user') {
        // Atualiza mensagem de usuário existente
        const assistantMessage = updatedMessages.find(msg =>
          msg.pairId === currentMessage.pairId && msg.sender === 'assistant'
        );

        if (assistantMessage) {
          const trainingPair = {
            pairId: currentMessage.pairId,
            userMessage: inputValue,
            assistantMessage: assistantMessage.text,
            isUpdate: true
          };
          sendToBackend(trainingPair, true);
        }
      } else if (currentMessage?.sender === 'assistant') {
        // Atualiza mensagem de assistente existente
        const userMessage = updatedMessages.find(msg =>
          msg.pairId === currentMessage.pairId && msg.sender === 'user'
        );

        if (userMessage) {
          const trainingPair = {
            pairId: currentMessage.pairId,
            userMessage: userMessage.text,
            assistantMessage: inputValue,
            isUpdate: true
          };
          sendToBackend(trainingPair, true);
        }
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setEditingId(1);
      setInputValue('');
      setTimeout(() => {
        setAnchorEl(messageRefs.current[1]);
      }, 100);
    }
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ flex: 1, overflowX: 'hidden', overflowY: 'auto', mb: 2, width: '100%' }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              mb: 2,
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              position: 'relative'
            }}
          >
            {message.sender === 'assistant' && <Avatar sx={{ bgcolor: 'primary.dark', mr: 1 }} src="/images/camila.webp" />}

            <ThoughtBubble
              isCurrentUser={message.sender === 'user'}
              ref={el => messageRefs.current[message.id] = el}
              onClick={(e) => !isSaving && handleEditMessage(message.id, message.text, e)}
              sx={{
                cursor: isSaving ? 'not-allowed' : 'pointer',
                border: editingId === message.id ? '2px dashed rgba(0,0,0,0.3)' : 'none',
                opacity: isSaving ? 0.7 : 1
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
              <Typography variant="caption" display="block" textAlign="right" sx={{ opacity: 0.7 }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </ThoughtBubble>

            {message.sender === 'user' && (
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: message.sender === 'user' ? -30 : 'auto',
                  left: message.sender === 'assistant' ? -30 : 'auto',
                  color: 'text.secondary'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenMenu(message, e);
                }}
                disabled={isSaving}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}

        {isSaving && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {saveError && (
          <Alert
            severity="error"
            variant='filled'
            sx={{ display: 'flex', alignItems: 'center' }}
            action={
              <IconButton
                color="inherit"
                onClick={handleRetry}
                size="small"
              >
                <ReplayIcon fontSize="small" />
              </IconButton>
            }
          >
            {saveError}
          </Alert>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => !isSaving && setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          sx: {
            bgcolor: '#1A365D',
            color: 'white',
            width: 350,
            p: 2,
            '& .MuiTextField-root': { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }
          }
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          {editingId && messages.find(m => m.id === editingId)?.sender === 'user'
            ? 'Editar mensagem do usuário'
            : 'Editar resposta da IA'}
        </Typography>

        <TextField
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          fullWidth
          multiline
          rows={3}
          error={!!errorInput}
          helperText={errorInput}
          placeholder={inputValue === '' ? (
            editingId && messages.find(m => m.id === editingId)?.sender === 'user'
              ? 'Digite uma mensagem...'
              : 'O que a IA deve responder?'
          ) : ""}
          sx={{ '& .MuiInputBase-input': { color: 'white', fontSize: '1rem' } }}
          disabled={isSaving}
        />

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 2 }} />

        <Button
          variant="contained"
          onClick={handleSave}
          fullWidth
          sx={{ bgcolor: 'primary.main', color: 'white' }}
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {editingId && messages.find(m => m.id === editingId)?.sender === 'user'
            ? 'Próximo'
            : isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      </Popover>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
      >
        <MenuItem onClick={handleDeletePair}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Excluir par de mensagens" primaryTypographyProps={{ color: 'error' }} />
        </MenuItem>
      </Menu>
    </Box>
  );
}