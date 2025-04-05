import { Box, Container, Link, Typography } from '@mui/material';
import React from 'react';

const Terms = () => {
  return (
    <Box component="div" sx={{ }}>
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ fontSize: '0.75rem' }}
        >
          Ao usar este serviço, você concorda com nossos{' '}
          <Link href="#" color="inherit" underline="hover">Termos</Link> e{' '}
          <Link href="#" color="inherit" underline="hover">Privacidade</Link>.
          <br />
          © {new Date().getFullYear()} Chat Assistente. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box >
  );
};

export default Terms;