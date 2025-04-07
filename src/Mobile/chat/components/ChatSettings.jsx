import * as React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Button,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StorageIcon from '@mui/icons-material/Storage';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ChatIcon from '@mui/icons-material/Chat';
import MemoryIcon from '@mui/icons-material/Memory';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import { useSession } from '../../../contexts/SessionContext';

export default function ChatSettingsPage({ selected }) {
  const theme = useTheme();
  const { user } = useSession();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [settings, setSettings] = React.useState({
    notifications: true,
    saveContext: true,
    memoryTraining: false,
    autoDownload: true,
    cloudBackup: false
  });

  const chat = user?.chats?.find(c => c?.id === selected);

  const handleToggle = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleDeleteChat = () => {
    console.log("Chat deletado:", chat.id);
    setOpenDeleteDialog(false);
    // Adicionar lógica para deletar o chat
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.paper',
      pt: 9,
    }}>
      {/* Cabeçalho */}
      <Typography variant="h6" sx={{ ml: 3 }}>
        Configurações do Chat
      </Typography>

      {/* Lista de Configurações */}
      <List sx={{ width: '100%' }}>
        {/* Notificações */}
        <ListItem>
          <ListItemIcon>
            <NotificationsIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Notificações"
            secondary="Receber alertas deste chat"
          />
          <Switch
            checked={settings.notifications}
            onChange={() => handleToggle('notifications')}
            color="primary"
          />
        </ListItem>
        <Divider component="li" />

        {/* Contexto */}
        <ListItem>
          <ListItemIcon>
            <ChatIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Manter contexto"
            secondary="Lembrar conversas anteriores"
            secondaryTypographyProps={{
              sx: { display: 'flex', alignItems: 'center' }
            }}
          />
          <Switch
            checked={settings.saveContext}
            onChange={() => handleToggle('saveContext')}
            color="primary"
          />
        </ListItem>
        <Divider component="li" />

        {/* Treinamento */}
        <ListItem>
          <ListItemIcon>
            <MemoryIcon color="primary" />
          </ListItemIcon>
          <Box>
            <ListItemText
              primary="Aprendizado contínuo"
              secondary="Melhorar respostas baseado nas interações"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <HelpIcon color="action" fontSize="small" />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                Usa mensagens para aprimorar este chat específico
              </Typography>
            </Box>
          </Box>
          <Switch
            checked={settings.memoryTraining}
            onChange={() => handleToggle('memoryTraining')}
            color="primary"
          />
        </ListItem>
        <Divider component="li" />

        {/* Armazenamento */}
        <ListItem>
          <ListItemIcon>
            <StorageIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Armazenamento local"
            secondary="Salvar mídias automaticamente"
          />
          <Switch
            checked={settings.autoDownload}
            onChange={() => handleToggle('autoDownload')}
            color="primary"
          />
        </ListItem>
        <Divider component="li" />

        {/* Backup */}
        <ListItem>
          <ListItemIcon>
            <InsightsIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Aprender memórias"
            secondary="Permite à IA captar memórias para usar em contexto*"
          />
          <Switch
            checked={settings.cloudBackup}
            onChange={() => handleToggle('cloudBackup')}
            color="primary"
          />
        </ListItem>
      </List>

      {/* Ações perigosas */}
      <Box sx={{ px: 2, mt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Ações
        </Typography>
        <Card sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Button
            fullWidth
            startIcon={<DeleteForeverIcon />}
            sx={{
              justifyContent: 'flex-start',
              color: theme.palette.error.main,
              px: 2,
              py: 1.5
            }}
            onClick={() => setOpenDeleteDialog(true)}
          >
            Excluir este chat permanentemente
          </Button>
        </Card>
      </Box>

      {/* Informações */}
      <Box sx={{ px: 2, mt: 3, display: 'flex', alignItems: 'center' }}>
        <InfoIcon color="info" sx={{ mr: 1 }} />
        <Typography variant="caption" color="text.secondary">
          Configurações aplicam-se apenas a este chat
        </Typography>
      </Box>

      {/* Diálogo de confirmação */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir permanentemente este chat com {chat?.name}?
            Todas as mensagens e memórias serão perdidas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteChat}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}