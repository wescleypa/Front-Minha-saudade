'use client'

import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { EmojiEmotions, Memory, Audiotrack } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import { useSession } from '../../../contexts/SessionContext';

export default function Lembrancas({ camila, update }) {
  const { user } = useSession();
  const [value, setValue] = useState(user?.history || '');
  const textareaRef = useRef(null);
  const [minRows, setMinRows] = useState(3);
  const [maxRows, setMaxRows] = useState(10);

  useEffect(() => {
    if (user?.chats) {
      const chatEncontrado = user.chats.find(chat => chat.id === camila);
      if (chatEncontrado) {
        setValue(chatEncontrado?.history || '');
      }
    }
  }, [user, camila]);

  useEffect(() => {
    if (textareaRef.current) {
      // Redefine a altura para recalcular
      textareaRef.current.style.height = 'auto';
      // Define a nova altura baseada no scrollHeight
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxRows * 24 // 24px por linha (aproximadamente)
      )}px`;
    }
  }, [value, maxRows]);

  return (
    <Container maxWidth="lg">
      <Stack
        component={Box}
        textAlign="center"
        spacing={{ xs: 4, md: 8 }}
        py={5}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 600,
            fontSize: {
              xs: '2rem',
              sm: '3rem',
              md: '4rem'
            },
            lineHeight: 1.1
          }}
        >
          Conte suas <br />
          <Box
            component="span"
            sx={{ color: 'primary.main' }}
          >
            histórias
          </Box>
        </Typography>

        <Box
          sx={{
            margin: '0 auto',
            padding: 1,
            textAlign: 'center',
            color: 'rgba(0, 0, 0, 0.8)'
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 500,
              lineHeight: 1.2,
              mb: 3,
              fontFamily: '"Playfair Display", serif'
            }}
          >
            A saudade é um quebra-cabeça de pequenos eternos.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              lineHeight: 1.6
            }}
          >
            Algumas memórias ficam guardadas num canto da mente como fotografias desbotadas – ainda lá, mas perdendo os contornos. Outras são sussurros, quase imperceptíveis, mas que doem quando alguém pronuncia certo nome.
          </Typography>

          <Typography
            variant="h5"
            component="h3"
            textAlign="left"
            sx={{
              fontWeight: 500,
              mb: 3,
              fontFamily: '"Playfair Display", serif'
            }}
          >
            Por isso, quanto mais você nos contar, mais a IA consegue:
          </Typography>

          <Stack spacing={3} sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left' }}>
              <EmojiEmotions
                sx={{
                  color: '#ff9e80',
                  mr: 2,
                  fontSize: '2rem'
                }}
              />
              <Box>
                <Typography variant="h6" component="h4" sx={{ fontWeight: 500 }}>
                  Reconstruir não só o cenário, mas o clima
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  (afinal, saudade tem cheiro, tem textura, tem som)
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left' }}>
              <Memory
                sx={{
                  color: '#81d4fa',
                  mr: 2,
                  fontSize: '2rem'
                }}
              />
              <Box>
                <Typography variant="h6" component="h4" sx={{ fontWeight: 500 }}>
                  Reconectar você não só com o fato, mas com o sentimento
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  (porque o que importa não é o onde, mas o como)
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', textAlign: 'left' }}>
              <Audiotrack
                sx={{
                  color: '#ce93d8',
                  mr: 2,
                  fontSize: '2rem'
                }}
              />
              <Box>
                <Typography variant="h6" component="h4" sx={{ fontWeight: 500 }}>
                  Trazer de volta o que o tempo apagou
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  (um dia, um olhar, uma música que parou de tocar)
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Typography
            variant="body1"
            sx={{
              fontSize: '1.2rem',
              fontWeight: 500,
              mb: 2
            }}
          >
            Não tenha medo de ser específico.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              mb: 4,
              lineHeight: 1.6
            }}
          >
            Fale da cor da cortina, do apelido que só ela(e) usava, do jeito que o vento batia naquele lugar.
            <br />
            Nós transformamos esses fios de lembrança em algo que você pode segurar de novo.
          </Typography>
        </Box>

        <Box sx={{ mx: 'auto' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>
            Descreva sua saudade com todos os detalhes...
          </Typography>

          <TextField
            inputRef={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            multiline
            minRows={minRows}
            maxRows={maxRows}
            slotProps={{
              htmlInput: {
                maxLength: 1000
              },
            }}
            fullWidth
            variant="outlined"
            placeholder="Fale sobre o cheiro da casa, a textura daquele tecido favorito, o tom de voz que você nunca esqueceu..."
            helperText="Máximo de 1000 caracteres"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& textarea': {
                  resize: 'vertical', // Permite redimensionamento manual também
                  lineHeight: 1.5,
                  padding: '16.5px 14px',
                },
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
            Quanto mais detalhes você der, mais rica será a reconstrução
          </Typography>
        </Box>

      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (value && value?.length > 1) {
              update(camila, 'history', value);
            }
          }}
        >
          Atualizar conhecimentos
        </Button>
      </Box>
    </Container>
  );
}

const Arrow = styled('svg')({
  viewBox: '0 0 72 24',
  path: {
    fillRule: 'evenodd',
    clipRule: 'evenodd',
    d: 'M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z',
    fill: 'currentColor'
  }
});