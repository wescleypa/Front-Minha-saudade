import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import HelpIcon from '@mui/icons-material/Help';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSession } from '../../../contexts/SessionContext';
import { Typography, Popover, Box, Button } from '@mui/material';

export default function ProfileMenu({ anchorEl, setAnchorEl, selected, setSelected, setPage }) {
  const { user, logout } = useSession();
  const open = Boolean(anchorEl);
  const chat = user?.chats?.find(c => c?.id === selected);

  const [showLogout, setShowLogout] = React.useState(false);
  const modalLogoutOpen = Boolean(showLogout);

  const handleClose = () => {
    setAnchorEl(null);
    setShowLogout(null);
  };

  const handleLogoutUser = () => {
    handleClose();
    logout();
    setSelected(null);
    setPage('');
  };

  const handleHelp = () => {
    setAnchorEl(null);
    setPage('help');
  };

  const handleLogout = (e) => {
    setShowLogout(anchorEl);
    setAnchorEl(null);
  }

  const handleCloseLogout = () => setShowLogout(null);

  const goPage = (page) => {
    handleClose();
    setPage(page);
  };

  return (<>
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={() => goPage(selected !== null ? 'profile-chat' : 'profile')} sx={{ minWidth: 250 }}>
        <Avatar
          alt={selected !== null ? chat?.name : user?.name}
          src={selected !== null ? chat?.name : user?.avatar}
        />
        {
          selected !== null ?
            chat?.name?.split(' ')[0] || chat?.name || 'Desconhecido(a)' :
            user?.name?.split(' ')[0] || user?.name || 'Desconhecido(a)'
        }
        <Typography
          variant="body2"
          fontSize={10}
          fontFamily={'inherit'}
          sx={{ ml: 'auto' }}
        >
          {selected !== null ? 'Personalizar' : 'Acessar perfil'}
        </Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => goPage(selected === null ? 'settings' : 'settings-chat')}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Configurações
      </MenuItem>

      {selected !== null && (
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ModelTrainingIcon fontSize="small" />
          </ListItemIcon>
          Treinar
        </MenuItem>
      )}

      <MenuItem onClick={handleHelp}>
        <ListItemIcon>
          <HelpIcon fontSize="small" />
        </ListItemIcon>
        Ajuda
      </MenuItem>

      {selected !== null && (
        <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Apagar conversa
        </MenuItem>
      )}

      {selected === null && (
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Desconectar
        </MenuItem>
      )}

    </Menu>

    <Popover
      id='logout-pop'
      open={modalLogoutOpen}
      anchorEl={showLogout}
      onClose={handleCloseLogout}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Typography sx={{ p: 2 }}>Tem certeza que deseja sair ?</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Button
          size="small"
          variant="outlined"
          sx={{ mr: 'auto' }}
          onClick={handleClose}
        >
          Cancelar
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleLogoutUser}
        >
          Sair
        </Button>
      </Box>
    </Popover>
  </>);
}
