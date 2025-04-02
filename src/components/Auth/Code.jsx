'use client'

import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  useTheme,
  TextField,
  Collapse,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useSession } from '../../contexts/SessionContext';

export default function Code({ setPage, codeAuth, setCodeAuth }) {
  const { socket } = useSocket();
  const theme = useTheme();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [codeOK, setCodeOK] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (index) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Aceita apenas números
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Foco automático no próximo campo
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  useEffect(() => {
    if (otp[0] !== '' && otp[1] !== '' && otp[2] !== '' && otp[3] !== '') {
      setCodeOK(true);
    } else {
      setCodeOK(false);
    }
  }, [otp]);

  const handleVerify = async () => {
    const code = otp.join('');

    if (codeAuth?.code !== code) {
      return setError('Código inválido.');
    }

    setError('');
    setLoading(true);

    await socket.emit('auth:verifyCode', codeAuth,
      (response) => {
        if (response.status === 'success') {
          setCodeAuth(Object.assign({}, response?.token, { email: codeAuth?.email }));
          setPage('changepw');
        } else {
          setError(response?.error ?? 'Erro ao logar, tente novamente ou contate o suporte.');
          console.error('Falha ao enviar mensagem:', response);
        }
        setLoading(false);
      }
    );
  };

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
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          textAlign: 'center',
          bgcolor: theme.palette.mode === 'light' ? 'background.paper' : 'grey.700',
          borderRadius: '16px' // equivalente ao 'xl' do Chakra
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h5" component="h1" gutterBottom>
            Verifique seu E-mail
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Enviamos um código para seu e-mail para confirmar sua conta.
          </Typography>

          <Typography variant="body1" fontWeight="bold" color="text.secondary">
            {codeAuth?.email}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Digite o código abaixo para confirmar sua conta.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, my: 2 }}>
            {otp.map((digit, index) => (
              <TextField
                disabled={loading}
                key={index}
                id={`otp-${index}`}
                value={digit}
                onChange={handleChange(index)}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center' }
                }}
                sx={{
                  width: 56,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.text.primary,
                    },
                  },
                }}
              />
            ))}
          </Box>

          <Collapse in={!!error}>
            <Typography variant="body2" color='red'>
              {error}
            </Typography>
          </Collapse>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{
              py: 1,
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
            disabled={!codeOK || loading}
            onClick={() => handleVerify()}
          >
            Verificar
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}