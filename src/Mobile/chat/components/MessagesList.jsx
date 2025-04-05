import { Error, Replay } from "@mui/icons-material";
import { Box, styled, keyframes, Avatar, Tooltip, Typography, IconButton } from "@mui/material";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

const ThoughtBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCurrentUser' && prop !== 'hasError'
})(({ theme, isCurrentUser, hasError }) => ({
  position: 'relative',
  maxWidth: '70%',
  padding: theme.spacing(1.5),
  borderRadius: '18px',
  backgroundColor: hasError
    ? 'white'
    : isCurrentUser
      ? theme.palette.primary.main
      : theme.palette.grey[300],
  color: hasError
    ? theme.palette.error.dark
    : isCurrentUser
      ? '#fff'
      : theme.palette.text.primary,
  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
  margin: '0',
  border: hasError ? `1px solid ${theme.palette.error.dark}` : 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: 0,
    [isCurrentUser ? 'right' : 'left']: '-8px',
    top: '12px',
    borderStyle: 'solid',
    borderWidth: hasError ? '0' : '8px 12px 8px 0',
    borderColor: `transparent ${hasError
      ? 'white'
      : isCurrentUser
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
    return `hoje às ${timeStr}`;
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


const MessagesList = ({ chat, message, enableDots = null, onRetry, onLike, onUnlike }) => {

  const handleRetry = () => {
    if (onRetry && message?.text) {
      onRetry(message);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: message?.sender === 'user' ? 'flex-end' : 'flex-start'
        }}
      >
        {message?.sender === 'assistant' && (
          <Avatar
            sx={{ bgcolor: 'primary.dark', mr: 1 }}
            src={chat?.avatar}
            alt={chat?.name}
          >
            <img
              src={window.location.origin + '/images/camila.webp'}
              alt={chat?.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </Avatar>
        )}

        <ThoughtBubble
          isCurrentUser={message?.sender === 'user'}
          hasError={message?.error}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {message?.error && (
              <Tooltip title={message?.errorMessage || "Erro ao enviar mensagem"}>
                <Error sx={{ cursor: 'pointer', mr: 1 }} />
              </Tooltip>
            )}

            <Typography variant="body1">
              {message?.text}
            </Typography>

            {message?.error && !enableDots && onRetry && (
              <Tooltip title="Tentar novamente">
                <IconButton
                  size="small"
                  onClick={handleRetry}
                  sx={{ p: 0, ml: 1 }}
                >
                  <Replay fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {!!enableDots && <TypingDots />}
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 0.5
          }}>
            {!enableDots && !message?.error && (
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.7,
                  color: message?.error ? 'error.main' : 'inherit'
                }}
              >
                {formatMessageDate(message?.time) || message?.time}
              </Typography>
            )}
          </Box>
        </ThoughtBubble>
      </Box>

      {message?.sender === 'assistant' && !enableDots && !message?.error && (
        <Box sx={{
          display: 'flex',
          gap: 0.2,
          ml: '54px'
        }}>
          <IconButton size="small" sx={{ p: 0.5 }} onClick={() => onLike(message)}>
            <ThumbUpAltIcon fontSize="small" color={!!message?.liked ? "success" : "action"} />
          </IconButton>
          <IconButton size="small" sx={{ p: 0.5 }} onClick={() => onUnlike(message)}>
            <ThumbDownAltIcon fontSize="small" color={!!message?.unliked ? "error" : "action"} />
          </IconButton>
        </Box>
      )}
    </Box>);
};

export default MessagesList;

