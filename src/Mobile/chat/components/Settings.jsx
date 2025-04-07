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
  Popover,
  TextField,
  Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import PaletteIcon from '@mui/icons-material/Palette';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { useSession } from '../../../contexts/SessionContext';
import { useSocket } from '../../../contexts/SocketContext';

export default function SettingsPage({ setPage }) {
  const { socket } = useSocket();
  const { user, setUser, setError } = useSession();

  const [showAccountDelete, setShowAccountDelete] = React.useState(false);

  const updateUserConfig = async (setting) => {
    const backup = Boolean(!user[setting]);
    setUser((prev) => ({ ...prev, [setting]: !prev[setting] }));

    await socket.emit('user:update:config', { column: setting, value: backup }, (response) => {
      if (!response?.success) {
        setUser((prev) => ({ ...prev, [setting]: !backup }));
        const errMessage = !!response?.error ?
          response?.error?.toString()?.toUpperCase()?.includes('SESSÃO') ?
            response?.error :
            'Falha ao atualizar, tente novamente ou contate o suporte.' :
          'Falha ao atualizar, tente novamente ou contate o suporte.';
        setError(errMessage);
      }
    });
  };

  const handleToggreTwoFactor = () => {
    if (!user?.phone || !user?.phone_verified) {
      return setPage('verify_phone');
    }
  };

  const handleShowAccountDelete = (e) => setShowAccountDelete(e?.currentTarget);
  const handleCloseAccountDelete = () => setShowAccountDelete(null);

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.paper',
      pb: 8,
      pt: 8
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
            checked={!!user?.theme}
            onChange={() => updateUserConfig('theme')}
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
            checked={!!user?.notification_app}
            onChange={() => updateUserConfig('notification_app')}
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
            checked={!!user?.notification_email}
            onChange={() => updateUserConfig('notification_email')}
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
            checked={!!user?.crud}
            onChange={() => updateUserConfig('crud')}
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
            checked={!!user?.two_factor_enabled}
            onChange={handleToggreTwoFactor}
            color="primary"
          />
        </ListItem>
        <Divider component="li" />

        {/* Dados */}
        <ListItem onClick={handleShowAccountDelete}>
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

      <Popover
        id="pop-delete-account"
        open={!!showAccountDelete}
        anchorEl={showAccountDelete}
        onClose={handleCloseAccountDelete}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography textAlign={'center'} variant="h6">Tem certeza disso ?</Typography>
          <Typography textAlign={'left'} variant="body2" color="grey">
            Ao solicitar a exclusão de sua conta,
            será agendado a remoção para&nbsp;
            <Typography component={'span'} sx={{ color: 'error.main' }}>14 dias</Typography>
            &nbsp;à contar do dia de hoje.<br /><br />
            Você receberá um E-mail orientando sobre a exclusão de sua conta e de como prosseguir para cancelar.<br /><br />
          </Typography>

          <Typography sx={{ fontWeight: 600, color: 'grey' }}>Importante:</Typography>
          <Typography sx={{ color: 'grey' }}>O processo de exclusão remove quase tudo que estiver ligado à sua conta, como: Conversas, mensagens, memórias e outros.</Typography><br />
          <Typography sx={{ color: 'grey' }}>Para prosseguir com a exclusão de sua conta, digite sua senha abaixo.</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField type="password" variant="outlined" label="Confirme sua senha" />
            <Button variant="contained" size="small">Agendar exclusão</Button>
          </Box>
          <Button sx={{ mt: 2 }} onClick={handleCloseAccountDelete} fullWidth variant="outlined" size="small">Cancelar</Button>
        </Box>
      </Popover>
    </Box>
  );
}