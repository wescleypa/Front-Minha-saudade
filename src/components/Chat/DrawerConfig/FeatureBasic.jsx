'use client'

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const features = [
  {
    icon: '🎭',
    title: 'Personalidade que Conecta',
    text: 'Traços únicos faz a IA responder como você preferir – seja mais humana, técnica ou criativa – criando interações que realmente soam como uma conversa.'
  },
  {
    icon: '😊',
    title: 'Tom & Humor Sob Medida',
    text: 'Garante que a IA se adapte ao seu momento – perfeito para dias produtivos ou descontraídos.'
  },
  {
    icon: '🌐',
    title: 'Identidade Cultural',
    text: 'Referências e expressões regionais fazem a IA "falar sua língua", literalmente – sem traduções artificiais.'
  },
  {
    icon: '🛡️',
    title: 'Sensibilidade',
    text: 'Limites para tópicos delicados e evite respostas indesejadas, mantendo o conforto em cada interação.'
  },
];

export default function FeatureBasic() {
  const theme = useTheme();

  return (
    <Box p={4}>
      <Stack component={Container}>
        <Typography textAlign="center" variant="h5" fontSize="3xl" gutterBottom>
          Aprimoramento de Perfil
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Ao ajustar os traços de personalidade, você cria uma experiência de conversa mais autêntica e alinhada com suas preferências. Isso faz com que a IA não apenas responda de forma inteligente, mas também se conecte emocionalmente, tornando as interações mais naturais e humanizadas.
        </Typography>
      </Stack>

      <Container maxWidth="xl" sx={{ mt: 5 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Box color="success.main" px={1}>
                  {feature?.icon}
                </Box>
                <Stack spacing={1} alignItems="flex-start">
                  <Typography fontWeight={600}>{feature.title}</Typography>
                  <Typography color="text.secondary">{feature.text}</Typography>
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}