import React from 'react';
import { Modal, Box, Typography, Button, Divider, Link } from '@mui/material';
import { AppRegistration, Login } from '@mui/icons-material';

const styleLoginModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 380,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
  p: 4,
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2
};

export const LoginModal = ({ open, close, setPage }) => {

  const goPage = (page) => {
    close();
    setPage(page);
  };

  return (
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="login-modal-title"
    >
      <Box sx={styleLoginModal}>
        {/* Logo/Cabeçalho */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={600} color="primary">
            Minha Saudade
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Conecte-se para aproveitar todas funcionalidades
          </Typography>
        </Box>

        {/* Botão de Login */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            borderRadius: '8px',
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
          onClick={() => goPage('register')}
        >
          <AppRegistration sx={{ mr: 1.5 }} />
          Cadastre-se grátis
        </Button>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          sx={{
            borderRadius: '8px',
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            borderColor: 'divider',
            color: 'text.primary'
          }}
          onClick={() => goPage('login')}
        >
          <Login sx={{ mr: 1.5 }} />
          Acesse sua conta
        </Button>

        {/* Divisor */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          my: 2
        }}>
          <Divider sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
            ou
          </Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>

        {/* Opção de continuar sem login */}
        <Button
          fullWidth
          variant="text"
          sx={{
            textTransform: 'none',
            color: 'primary.main',
            fontWeight: 500
          }}
          onClick={close}
        >
          Continuar sem login
        </Button>

        {/* Termos de serviço */}
        <Typography variant="caption" color="text.secondary" sx={{
          mt: 3,
          textAlign: 'center',
          lineHeight: 1.4
        }}>
          Ao continuar, você concorda com nossos{' '}
          <Link href="#" underline="hover">Termos de Serviço</Link> e{' '}
          <Link href="#" underline="hover">Política de Privacidade</Link>.
        </Typography>
      </Box>
    </Modal>
  );
};