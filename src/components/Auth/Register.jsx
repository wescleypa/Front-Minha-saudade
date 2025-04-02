'use client';

import { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  Paper,
  IconButton,
  MobileStepper,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LockIcon from '@mui/icons-material/Lock';
import MemoryIcon from '@mui/icons-material/Memory';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { styled } from '@mui/material/styles';
import { useSocket } from '../../contexts/SocketContext';

const BlurBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '100%', // Removemos a condicional para mobile
  [theme.breakpoints.up('md')]: {
    width: '40vw'
  },
  [theme.breakpoints.up('lg')]: {
    width: '30vw',
    zIndex: 0
  },
  height: '560px',
  zIndex: -1,
  top: -40,
  left: -40,
  filter: 'blur(70px)',
  background: `
    radial-gradient(circle at 71px 61px, #F56565, transparent 111px),
    radial-gradient(circle at 244px 106px, #ED64A6, transparent 139px),
    radial-gradient(circle at 0px 291px, #ED64A6, transparent 139px),
    radial-gradient(circle at 80.5px 189.5px, #ED8936, transparent 101.5px),
    radial-gradient(circle at 196.5px 317.5px, #ECC94B, transparent 101.5px),
    radial-gradient(circle at 70.5px 458.5px, #48BB78, transparent 101.5px),
    radial-gradient(circle at 426.5px -0.5px, #4299E1, transparent 101.5px)
  `,
}));

const GradientText = styled('span')(({ theme }) => ({
  background: theme.palette.mode === 'light'
    ? 'linear-gradient(45deg, #f44336, #e91e63)'
    : 'linear-gradient(45deg, #ff7961, #f48fb1)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const topics = [
  {
    icon: <AutoAwesomeIcon color="primary" />,
    title: "Reconexão com Propósito",
    description: "Mais que um app, somos uma ferramenta para cura emocional. 83% dos usuários relatam melhora significativa em seus relacionamentos, mesmo quando a reconciliação não acontece.",
    special: true
  },
  {
    icon: <FavoriteIcon color="secondary" />,
    title: "Reconexão Suave",
    description: "Nossa abordagem gradual ajuda a reconstruir laços sem pressão. Você controla o ritmo e nós fornecemos ferramentas para expressar seus sentimentos com delicadeza."
  },
  {
    icon: <PsychologyIcon color="secondary" />,
    title: "Mediação Inteligente",
    description: "Nossa IA analisa o contexto emocional para sugerir as melhores palavras e momentos para reconectar, evitando mal-entendidos e situações constrangedoras."
  },
  {
    icon: <LockIcon color="secondary" />,
    title: "Ambiente Seguro",
    description: "Todas as interações são protegidas com criptografia de ponta-a-ponta. Você decide o que compartilhar e quando, com controle total sobre sua privacidade."
  },
  {
    icon: <MemoryIcon color="secondary" />,
    title: "Lembranças Organizadas",
    description: "Armazene e organize fotos, mensagens e momentos especiais em uma linha do tempo afetiva, pronta para ajudar a reacender conexões quando você estiver preparado."
  }
];

export default function Register({ setPage, setCodeAuth }) {
  const theme = useTheme();
  const { socket } = useSocket();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Cadastrando sua conta...');
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = topics.length;
  const [errorForm, setErrorForm] = useState();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setError] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  const validForm = () => {
    var erros = { name: '', email: '', password: '' };

    if (!formData?.name.length || formData?.name.length <= 2) {
      erros.name = 'Nome é obrigatório';
    }

    if (!formData?.password.length || formData?.password.length < 8) {
      erros.password = 'Senha precisa ter no mínimo 8 caracteres';
    }

    if (!formData?.email.length || !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(formData?.email)) {
      erros.email = 'Digite um e-mail válido';
    }

    setError(erros);

    return !erros?.name && !erros?.email && !erros?.password;
  };

  const handleRegister = async () => {
    if (validForm()) {
      setLoading(true);

      await socket.emit(
        'register', { name: formData?.name, email: formData?.email, password: formData?.password },
        (response) => {
          console.log(' response ', response);
          if (response.status === 'success') {
            setCodeAuth({
              email: formData?.email,
              code: response?.data?.code
            });
            setPage('code');
          } else {
            setErrorForm(response?.error ?? 'Erro ao registrar, tente novamente ou contate o suporte.');
            console.error('Falha ao enviar mensagem:', response);
          }
          setLoading(false);
        }
      );
    }
  };

  const handleCloseAlert = () => setErrorForm();

  return (
    <Box position="relative" sx={{ overflow: { xs: 'auto', md: 'hidden' }, height: '100vh' }}>
      <Snackbar
        open={errorForm}
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
          {errorForm}
        </Alert>
      </Snackbar>
      <Container maxWidth="lg" sx={{ py: isMdUp ? 0 : 4, height: { xs: 'auto', md: '100%' } }}>
        <Grid container spacing={isLgUp ? 8 : isMdUp ? 6 : 4} sx={{ height: '100%' }}>
          {/* Coluna do carrossel */}
          <Grid item size={{ xs: 12, md: 6 }} sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography
              variant={isLgUp ? 'h2' : isMdUp ? 'h3' : 'h4'}
              lineHeight={1.1}
              fontWeight={700}
              zIndex={2}
              mb={4}
              textAlign="center"
            >
              Junte-se à outros usuários e pare de sentir <GradientText>saudade</GradientText>
            </Typography>

            <Box sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 800,
              mx: 'auto',
              px: 2,
              display: { xs: 'none', sm: 'block' }
            }}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  textAlign: 'center',
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 2
                }}
              >
                Por que usar o Minha Saudade?
              </Typography>

              {/* Slide atual */}
              <Box sx={{
                bgcolor: 'background.paper',
                p: 3,
                borderRadius: 2,
                boxShadow: topics[activeStep].special ? '0px 4px 20px rgba(0, 0, 0, 0.1)' : '0px 4px 12px rgba(0, 0, 0, 0.05)',
                border: topics[activeStep].special ? '2px solid' : 'none',
                borderColor: topics[activeStep].special ? 'primary.light' : 'none',
                position: 'relative',
                textAlign: 'center'
              }}>
                <Typography variant="h5" sx={{
                  color: topics[activeStep].special ? 'primary.main' : 'secondary.main',
                  mb: 3,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1
                }}>
                  {topics[activeStep].icon} {topics[activeStep].title}
                </Typography>
                <Typography color="text.secondary">
                  {topics[activeStep].description}
                </Typography>
              </Box>

              {/* Controles do carrossel */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 4,
                gap: 2
              }}>
                <IconButton
                  onClick={handleBack}
                  color="primary"
                  sx={{
                    bgcolor: 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected'
                    }
                  }}
                >
                  <KeyboardArrowLeft />
                </IconButton>

                <MobileStepper
                  variant="dots"
                  steps={maxSteps}
                  position="static"
                  activeStep={activeStep}
                  sx={{
                    flexGrow: 1,
                    maxWidth: 200,
                    bgcolor: 'transparent',
                    '& .MuiMobileStepper-dot': {
                      width: 10,
                      height: 10,
                      backgroundColor: 'action.disabled'
                    },
                    '& .MuiMobileStepper-dotActive': {
                      backgroundColor: 'primary.main'
                    }
                  }}
                  nextButton={null}
                  backButton={null}
                />

                <IconButton
                  onClick={handleNext}
                  color="primary"
                  sx={{
                    bgcolor: 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected'
                    }
                  }}
                >
                  <KeyboardArrowRight />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Coluna do formulário (fixa) */}
          <Grid item size={{ xs: 12, md: 6 }} sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                p: isMdUp ? 4 : 3,
                width: '100%',
                maxWidth: 500,
                mx: 'auto'
              }}
            >
              <Stack spacing={3}>
                <Typography
                  variant={isMdUp ? 'h3' : 'h4'}
                  fontWeight={700}
                  color="text.primary"
                >
                  Crie sua conta<GradientText>!</GradientText>
                </Typography>

                <Typography color="text.secondary">
                  Junte-se à comunidade que está transformando saudade em reencontros felizes.
                </Typography>

                <Box component="form" mt={3}>
                  <Stack spacing={3}>
                    <TextField
                      error={!!errors?.name}
                      helperText={errors?.name}
                      placeholder="Nome completo"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'action.hover',
                          '& fieldset': {
                            border: 'none'
                          }
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: 'text.secondary',
                          opacity: 1
                        }
                      }}
                      value={formData?.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e?.target?.value }))}
                      disabled={loading}
                    />

                    <TextField
                      error={!!errors?.email}
                      helperText={errors?.email}
                      placeholder="E-mail"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'action.hover',
                          '& fieldset': {
                            border: 'none'
                          }
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: 'text.secondary',
                          opacity: 1
                        }
                      }}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e?.target?.value }))}
                      disabled={loading}
                    />

                    <TextField
                      error={!!errors?.password}
                      helperText={errors?.password}
                      placeholder="Senha"
                      type="password"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'action.hover',
                          '& fieldset': {
                            border: 'none'
                          }
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: 'text.secondary',
                          opacity: 1
                        }
                      }}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e?.target?.value }))}
                      disabled={loading}
                    />

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{
                        mt: 2,
                        background: 'linear-gradient(45deg, #f44336, #e91e63)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #f44336, #e91e63)',
                          boxShadow: theme.shadows[6]
                        }
                      }}
                      onClick={() => handleRegister()}
                      disabled={loading}
                    >
                      {
                        loading ?
                          (
                            <Typography
                              variant="h7"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'white',
                                gap: 2
                              }}>
                              <CircularProgress /> {loadingMessage}
                            </Typography>
                          )
                          : 'Cadastrar'}
                    </Button>
                    <Typography textAlign={'center'}>
                      ou
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{
                        mt: 1,
                        background: 'white',
                        border: '1px solid #e91e63',
                        color: '#e91e63',
                        '&:hover': {
                          boxShadow: theme.shadows[6]
                        }
                      }}
                      disabled={loading}
                      onClick={() => setPage('login')}
                    >
                      Faça login
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <BlurBackground />
    </Box>
  );
}