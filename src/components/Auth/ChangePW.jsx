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
import { useSession } from '../../contexts/SessionContext';

export default function ChangePW({ setPage, codeAuth, setCodeAuth }) {
  const theme = useTheme();
  const { setUser } = useSession();
  const { socket } = useSocket();
  const [pass, setPass] = useState();
  const [confirmPass, setConfirmPass] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState();
  const [error, setError] = useState();

  const handleSubmit = async () => {
    if (!pass || !confirmPass) return setErrors({ pass: 'Campo obrigatório.' });
    if (pass !== confirmPass) return setErrors({ pass: 'Senha e confirmação não confere.' });
    if (pass?.length < 8) return setErrors({ pass: 'Senha precisa ter no mínimo 8 caracteres' });

    setLoading(true);

    await socket.emit('auth:changepw', { token: codeAuth?.token, pass, confirmPass, email: codeAuth?.email }, (response) => {
      if (response?.status === 'success') {
        setUser(response?.data);
        setCodeAuth();
        setPage('');
      } else {
        setError(response?.error ?? 'Falha ao atualizar.');
      }
    });
    setLoading(false);
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
            Alteração de senha
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Digite abaixo sua nova senha, tome cuidado para não errar.
          </Typography>

          <TextField
            fullWidth
            id="senha"
            label="Nova senha"
            placeholder=""
            type="text"
            variant="outlined"
            helperText={errors?.pass ?? "Digite sua nova senha"}
            value={pass}
            onChange={(e) => setPass(e?.target?.value)}
            error={!!errors?.pass}
            disabled={loading}
          />

          <TextField
            fullWidth
            id="confirmpass"
            label="Confirmação de senha"
            placeholder=""
            type="password"
            variant="outlined"
            helperText={errors?.confirmPass ?? "Confirme a nova senha"}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e?.target?.value)}
            error={!!errors?.confirmPass}
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
            disabled={loading}
            onClick={() => handleSubmit()}
          >
            {loading ? (
              <Typography
                sx={{ display: 'flex', alignItems: 'center', color: 'white' }}
                variant="h7"
                fontSize={14}
              >
                <CircularProgress />&nbsp;&nbsp;Validando alteração...
              </Typography>
            ) : 'Alterar senha'}
          </Button>

          <Typography textAlign="center">
            Desistiu ?
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{
              py: 1,
            }}
            onClick={() => setPage('')}
            disabled={loading}
          >
            Continue sem login
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}