import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Container,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { VolunteerActivism, ContentCopy, Check, WhatsApp } from '@mui/icons-material';
import { useSocket } from '../../../contexts/SocketContext';
import { useSession } from '../../../contexts/SessionContext';

const VerifyPhone = ({ setPage }) => {
  const { socket } = useSocket();
  const { user, setUser, setError, update } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [codeExpiryTime, setCodeExpiryTime] = useState(null);
  const [expiredDialogOpen, setExpiredDialogOpen] = useState(false);
  const [phone, setPhone] = useState('');

  socket.on('phone:verified', async (result) => {
    if (!!result) {
      await update('phone', phone);
      await update('phone_verified', true);
      setPage('questTwoFactor');
    }
  });

  useEffect(() => {
    if (!codeExpiryTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = codeExpiryTime - now;

      if (diffMs <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        setExpiredDialogOpen(true); // Mostra o diálogo de expirado
        setStep(1); // Volta para a tela de telefone
      } else {
        setTimeLeft(Math.floor(diffMs / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [codeExpiryTime]);

  const LoadingDots = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev.length >= 3) return '';
          return prev + '.';
        });
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return <span>{dots}</span>;
  };

  const phoneRegex = /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/;

  const formatPhone = (value) => {
    if (!value || value?.length <= 0) return value;
    const digits = value.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 11);

    if (limitedDigits.length <= 2) return limitedDigits;
    if (limitedDigits.length <= 6) return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2)}`;
    if (limitedDigits.length <= 10) return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 6)}-${limitedDigits.slice(6)}`;
    return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2, 7)}-${limitedDigits.slice(7)}`;
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhone(e.target.value);
    setPhone(formattedPhone);
    setTouched(true);
  };

  useEffect(() => {
    setIsValid(phoneRegex.test(phone));
  }, [phone]);

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid) {
      setUser((prev) => ({ ...prev, phone, phone_verified: false }));
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const code = generateVerificationCode();
      setVerificationCode(code);
      setStep(2);
      setCodeExpiryTime(new Date(Date.now() + 5 * 60 * 1000));
      setIsLoading(false);

      await socket.emit('user:verifyCode:save', { type: 2, relation: phone, code, time: 5 }, (response) => {
        if (response?.success) {
          setCodeExpiryTime(new Date(response?.expiry ?? new Date()));
        } else {
          setStep(1);
          setError(response?.error ?? 'Falha ao gerar autenticação segura, tente novamente ou contate o suporte');
        }
      });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopied(true);
    setSnackbarOpen(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatarTempoRestante = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const whatsappNumber = '55' + process.env.REACT_APP_OFC_NUMBER;
  const whatsappMessage = `Código de verificação: ${verificationCode}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? 2 : 4
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: 'monospace',
          fontWeight: 600,
          letterSpacing: '-1px',
          color: 'error.light',
          textDecoration: 'none',
          mb: 4
        }}
      >
        <VolunteerActivism sx={{ verticalAlign: 'middle', mr: 1 }} />
        Minha saudade
      </Typography>

      {step === 1 ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Verificação de Telefone
          </Typography>

          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
            Digite seu número de celular com DDD
          </Typography>

          <TextField
            fullWidth
            variant="outlined"
            label="Telefone"
            placeholder="(99) 99999-9999"
            value={user?.phone || phone}
            onChange={handlePhoneChange}
            error={touched && !isValid}
            helperText={touched && !isValid ? "Digite um telefone válido" : ""}
            inputProps={{
              inputMode: 'numeric',
              maxLength: 15
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!isValid || isLoading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Verificar Telefone'}
          </Button>
        </Box>
      ) : (
        <Box sx={{
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Typography variant="h5" align="center">
            Confirme seu telefone
          </Typography>

          <Typography variant="inherit" align="center" gutterBottom>
            {user?.phone}
          </Typography>

          <Typography sx={{ mt: 2 }} variant="body1" align="center">
            Envie este código para nosso WhatsApp:
          </Typography>

          <Typography variant="h4" align="center" sx={{ mb: 3, letterSpacing: '4px' }}>
            {verificationCode}
          </Typography>

          <Typography variant="body2" align="center" gutterBottom>
            O código expira em {formatarTempoRestante(timeLeft)}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={verificationCode}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleCopyCode}>
                      {copied ? <Check color="success" /> : <ContentCopy />}
                    </IconButton>
                  </InputAdornment>
                ),
                readOnly: true
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="success"
            size="large"
            fullWidth
            href={whatsappUrl}
            target="_blank"
          >
            <WhatsApp sx={{ color: 'text.secondary' }} />&nbsp;
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Confirmar telefone</Typography>
          </Button>

          <Typography variant="subtitle2" align="center" color="text.secondary">
            Ou mande o código para {formatPhone(process.env.REACT_APP_OFC_NUMBER)} via WhatsApp.
          </Typography>

          <Typography variant="body1" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
            Aguardando confirmação<LoadingDots />
          </Typography>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Código copiado para a área de transferência!
        </Alert>
      </Snackbar>

      {/* Diálogo de código expirado */}
      <Dialog
        open={expiredDialogOpen}
        onClose={() => setExpiredDialogOpen(false)}
      >
        <DialogTitle>Código expirado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            O código de verificação expirou. Por favor, solicite um novo código.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExpiredDialogOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VerifyPhone;