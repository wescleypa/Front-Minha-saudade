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
  IconButton,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import PaletteIcon from '@mui/icons-material/Palette';
import StorageIcon from '@mui/icons-material/Storage';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

export default function SettingsPage() {
  const theme = useTheme();
  const [settings, setSettings] = React.useState({
    darkMode: false,
    appNotifications: true,
    emailNotifications: false,
    saveMessages: true,
    analytics: false,
    twoFactorAuth: false
  });

  const handleToggle = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.paper',
      pb: 8,
    }}>
      {/* Cabeçalho */}
      <Typography variant="h6" sx={{ pl: 3 }}>
        Configurações
      </Typography>

      {/* Lista de Configurações */}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {/* Aparência */}
        <ListItem>
          <ListItemIcon>
            <PaletteIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Tema escuro"
            secondary="Ativar modo noturno"
          />
          <Switch
            checked={settings.darkMode}
            onChange={() => handleToggle('darkMode')}
            color="primary"
          />
        </ListItem>
        <Divider component="li" />

        {/* Notificações */}
        <ListItem>
          <ListItemIcon>
            <NotificationsIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Notificações por app"
            secondary="Receber alertas no dispositivo"
          />
          <Switch
            checked={settings.appNotifications}
            onChange={() => handleToggle('appNotifications')}
            color="primary"
          />
        </ListItem>
        <Divider component="li" />

        <ListItem>
          <ListItemIcon>
            <EmailIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Notificações por e-mail"
            secondary="Receber resumos por e-mail"
          />
          <Switch
            checked={settings.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
            color="primary"
          />
        </ListItem>
        <Divider component="li" />

        {/* Privacidade */}
        <ListItem>
          <ListItemIcon>
            <AllInclusiveIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Conversa contínua"
            secondary="Receber mensagens após fim de conversa"
          />
          <Switch
            checked={settings.saveMessages}
            onChange={() => handleToggle('saveMessages')}
            color="primary"
          />
        </ListItem>
        <Divider component="li" />

        <ListItem>
          <ListItemIcon>
            <LockIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Autenticação em 2 fatores"
            secondary="Maior segurança na conta"
          />
          <Switch
            checked={settings.twoFactorAuth}
            onChange={() => handleToggle('twoFactorAuth')}
            color="primary"
          />
        </ListItem>
        <Divider component="li" />

        {/* Dados */}
        <ListItem>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography color="error">Excluir minha conta</Typography>}
            secondary="Excluir conta e todas mensagens ligadas à ela"
          />
        </ListItem>
      </List>

      {/* Rodapé */}
      <Typography variant="body2" sx={{
        p: 2,
        textAlign: 'center',
        color: 'text.secondary'
      }}>
        Versão 1.0.0 · {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}