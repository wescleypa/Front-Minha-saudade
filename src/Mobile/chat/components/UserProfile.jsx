import * as React from 'react';
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  IconButton,
  Grid,
  styled
} from '@mui/material';
import { useSession } from '../../../contexts/SessionContext';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ChatIcon from '@mui/icons-material/Chat';
import LabelIcon from '@mui/icons-material/Label';
import { bestMiss } from '../../../components/Utils/geral';

const ThoughtBubble = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: '70%',
  padding: theme.spacing(1.5),
  borderRadius: '18px',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  alignSelf: 'flex-end',
  margin: '0',
  border: 'none',
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: 0,
    left: '-8px',
    top: '12px',
    borderStyle: 'solid',
    borderWidth: '8px 12px 8px 0',
    borderColor: `transparent ${theme.palette.primary.main} transparent transparent`,
    transform: '0'
  }
}));

export default function MobileProfilePage({ setPage }) {
  const { user } = useSession();

  const maiorSaudade = bestMiss(user?.chats);
  const lastMessage = maiorSaudade.messages.length > 0 ? maiorSaudade.messages.at(-1) : null;

  const mostMissedContact = {
    name: "Vovó Maria",
    avatar: "",
    lastMessage: "Te espero no almoço de domingo",
    chatId: 123
  };

  const stats = {
    totalMessages: 342,
    activeChats: 5,
    memories: 28
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', pt: 7 }}>

      {/* Seção do perfil */}
      <Card sx={{ mx: 2, boxShadow: 0 }}>
        <CardContent sx={{ pt: 4 }}>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Avatar
              sx={{
                width: 76,
                height: 76,
                border: '3px solid',
                borderColor: 'grey'
              }}
              src={user?.avatar}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight={600}>
                {user?.name}
              </Typography>

              <Typography variant="body2">
                {user?.email}
              </Typography>
            </Box>

            <IconButton sx={{ ml: 'auto' }} onClick={() => setPage('settings')}>
              <SettingsApplicationsIcon color="grey" />
            </IconButton>

          </Stack>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Box sx={{ mx: 2, mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Suas estatísticas
        </Typography>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box sx={{
              width: '100%',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              },
              p: 0
            }}>
              <Grid
                container
                spacing={2}
                sx={{
                  display: 'flex',
                  flexWrap: 'nowrap',
                  width: 'auto',
                  textAlign: 'center',
                  justifyContent: 'center'
                }}
              >
                <Grid item>
                  <Typography variant="body1" fontWeight={700}>
                    {stats.totalMessages}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Mensagens
                  </Typography>
                </Grid>

                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                  <Divider orientation="vertical" flexItem sx={{ height: 30 }} />
                </Grid>

                <Grid item>
                  <Typography variant="body1" fontWeight={700}>
                    {stats.activeChats}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Chats
                  </Typography>
                </Grid>

                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                  <Divider orientation="vertical" flexItem sx={{ height: 30 }} />
                </Grid>

                <Grid item>
                  <Typography variant="body1" fontWeight={700}>
                    32
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Memórias
                  </Typography>
                </Grid>

                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                  <Divider orientation="vertical" flexItem sx={{ height: 30 }} />
                </Grid>

                <Grid item>
                  <Typography variant="body1" fontWeight={700}>
                    {stats.memories}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Chats treinados
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Lembrança do dia */}
      <Box
        sx={{
          mx: 2, mt: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Box sx={{ mb: 2, color: 'error.light' }}>
          <LabelIcon />
        </Box>

        <ThoughtBubble>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">
              Lembra quando seu avô guardou feijão no bolso da jaqueta ?
            </Typography>
            <IconButton sx={{ color: 'background.paper' }}>
              <ChatIcon fontSize="small" />
            </IconButton>
          </Box>
        </ThoughtBubble>
      </Box>

      {/* Maior saudade */}
      <Box sx={{ mx: 2, mt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Maior saudade
        </Typography>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={mostMissedContact.avatar}>
                {maiorSaudade?.name?.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography>
                  {maiorSaudade?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {lastMessage?.text}
                </Typography>
              </Box>
              <IconButton size="medium">
                <ChatIcon color="errpr.main" />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Sugestão de lembranças */}
      <Box sx={{ mx: 2, mt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Reviva outras lembranças
        </Typography>

        <Box
          sx={{
            mx: 2, mt: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ mb: 4, color: 'error.light' }}>
            <LabelIcon />
          </Box>

          <ThoughtBubble>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">
                Lembra quando seu avô guardou feijão no bolso da jaqueta ?
              </Typography>
              <IconButton sx={{ color: 'background.paper' }}>
                <ChatIcon fontSize="small" />
              </IconButton>
            </Box>
          </ThoughtBubble>
        </Box>

        <Box
          sx={{
            mx: 2, mt: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ mb: 4, color: 'error.light' }}>
            <LabelIcon />
          </Box>

          <ThoughtBubble>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">
                Lembra quando seu avô guardou feijão no bolso da jaqueta ?
              </Typography>
              <IconButton sx={{ color: 'background.paper' }}>
                <ChatIcon fontSize="small" />
              </IconButton>
            </Box>
          </ThoughtBubble>
        </Box>

        <Box
          sx={{
            mx: 2, mt: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ mb: 4, color: 'error.light' }}>
            <LabelIcon />
          </Box>

          <ThoughtBubble>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">
                Lembra quando seu avô guardou feijão no bolso da jaqueta ?
              </Typography>
              <IconButton sx={{ color: 'background.paper' }}>
                <ChatIcon fontSize="small" />
              </IconButton>
            </Box>
          </ThoughtBubble>
        </Box>
      </Box>
    </Box>
  );
}