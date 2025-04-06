import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ProfileMenu from './ProfileMenu';
import { Avatar, Collapse, IconButton, Stack } from '@mui/material';
import { useSession } from '../../../contexts/SessionContext';

function MobileBar({ page, setPage, selected, setSelected }) {
  const { user } = useSession();
  const [menuUser, setMenuUser] = React.useState(null);
  const chat = user?.chats?.find(c => c?.id === selected);

  const openMenuUser = (e) => setMenuUser(e?.currentTarget);

  const goBack = () => {
    setSelected(null);
    setPage('');
  };

  const goPage = (page) => {
    setSelected(null);
    setPage(page);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: 'background.paper',
        boxShadow: 0,
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Botão Voltar (Canto Esquerdo Fixo) */}
          <Collapse
            in={((page !== '' && !!page) || selected !== null) && user?.token}
            orientation="horizontal"
            sx={{
              position: 'absolute',
              left: 16,
              top: 20,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                cursor: 'pointer',
                color: 'grey',
              }}
              onClick={() => goBack()}
            >
              <ArrowBackIosIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">Voltar</Typography>
            </Stack>
          </Collapse>

          {/* Logo (Centralizado quando não há seleção) */}
          <Collapse
            in={selected === null && (page === '' || !page)}
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>
          </Collapse>

          {/* Botões de Login/Registro (Centralizados quando não logado) */}
          <Collapse
            in={!user?.token}
            sx={{
              position: 'relative',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            <div style={{ display: 'flex' }}>
              <Button
                variant="outlined"
                size='small'
                color="primary"
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: 3,
                  mr: 1
                }}
                onClick={() => setPage('login')}
              >
                Login
              </Button>
              <Button
                variant="contained"
                size='small'
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
                onClick={() => setPage('register')}
              >
                Registrar
              </Button>
            </div>
          </Collapse>

          {/* Avatar (Canto Direito Fixo) */}
          <Collapse
            in={user?.token}
            orientation="horizontal"
            sx={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={openMenuUser}
            >
              <Typography
                variant='body2'
                color='grey'
                sx={{
                  mr: 1,
                  whiteSpace: 'nowrap'
                }}
              >
                {selected === null
                  ? `Olá ${user?.name?.split(' ')[0] || user?.name}`
                  : chat?.name?.split(' ')[0] || chat?.name || 'Desconhecido(a)'
                }
              </Typography>
              <IconButton aria-label="menu do usuário" edge="end">
                <Avatar
                  alt={selected !== null ? chat?.name : user?.name}
                  src={selected !== null ? chat?.avatar : user?.avatar}
                >
                  {(selected !== null ? chat?.name : user?.name)?.charAt(0)?.toUpperCase() || 'D'}
                </Avatar>
              </IconButton>
            </div>
          </Collapse>

          {/* Profile menu user */}
          <ProfileMenu
            anchorEl={menuUser}
            setAnchorEl={setMenuUser}
            selected={selected}
            setSelected={setSelected}
            setPage={setPage}
          />

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default MobileBar;