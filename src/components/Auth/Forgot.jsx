'use client'

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  Paper,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';

export default function Forgot({ setPage, setCodeAuth }) {
  const theme = useTheme();
  const { socket } = useSocket();
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMail, setErrorMail] = useState();
  const [error, setError] = useState();

  const handleReset = async () => {
    if (!email) return setErrorMail('E-mail é obrigatório');
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)) return setErrorMail('Digite um e-mail válido');
    setErrorMail();

    setLoading(true);
    await socket.emit('resetpassword', email, (response) => {
      if (response.status === 'success') {
        setCodeAuth({
          email: email,
          code: response?.data?.code
        });
        setPage('code');
      } else {
        setError(response?.error ?? 'Falha ao enviar código, tente novamente ou contate o suporte.')
      }
      setLoading(false);
    });
  };

  const handleCloseAlert = () => setError();

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          bgcolor: theme.palette.mode === 'light' ? 'background.paper' : 'grey.700',
          borderRadius: 4
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Esquece sua senha ?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Não se preocupe, vamos enviar um código de confirmação para seu e-mail para alterar sua senha.
          </Typography>

          <TextField
            fullWidth
            id="email"
            label="E-mail"
            placeholder="seu@email.com"
            type="email"
            variant="outlined"
            helperText={errorMail ?? "Qual é seu e-mail cadastrado ?"}
            value={email}
            onChange={(e) => setEmail(e?.target?.value)}
            error={!!errorMail}
            disabled={loading}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              py: 1.5,
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
            onClick={() => handleReset()}
            disabled={loading}
          >
            {loading ? (
              <Typography
                sx={{ display: 'flex', alignItems: 'center', color: 'white' }}
                variant="h7"
                fontSize={14}
              >
                <CircularProgress />&nbsp;&nbsp;Enviando código...
              </Typography>
            ) : 'Solicitar alteração'}
          </Button>

          <Typography textAlign="center">
            Lembrou da senha ?
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{
              py: 1,
            }}
            onClick={() => setPage('login')}
          >
            Acesse sua conta
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}