import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useSession } from '../../contexts/SessionContext';
import { Box } from '@mui/material';

export default function ChatUser({ setSelected }) {
  const { user } = useSession();

  // Ordena os chats pela data da última mensagem (mais recente primeiro)
  const sortedChats = React.useMemo(() => {
    if (!user?.chats) return [];

    return [...user.chats].sort((a, b) => {
      // Pega o time da última mensagem de cada chat
      const lastMsgA = a.messages?.slice(-1)[0]?.time || '';
      const lastMsgB = b.messages?.slice(-1)[0]?.time || '';

      // Converte para Date e compara
      return new Date(lastMsgB) - new Date(lastMsgA);
    });
  }, [user?.chats]);

  const goChat = (chatID) => {
    setSelected(chatID);
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', height: 'calc(100vh - 64px)' }}>
      {sortedChats.map((chat, index) => (
        <Box key={index} onClick={() => goChat(chat?.id)}
          sx={{
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={chat?.name} src={chat?.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2">
                  {chat?.name || 'Desconhecido(a)'}
                </Typography>
              }
              secondary={chat?.messages?.slice(-1)[0]?.text}
              secondaryTypographyProps={{
                noWrap: true,
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }
              }}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Box>
      ))}
    </List>
  );
}