import { Box, Typography } from '@mui/material';
import React from 'react';

const ContentEmpty = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1,
      height: '100%',
      gap: 5
    }}>
      <Typography
        variant="h2"
        fontWeight={600}
        lineHeight="110%"
        sx={{
          fontSize: { xs: '3rem', sm: '3rem', md: '4rem' },
          textAlign: 'center'
        }}
      >
        Qual nome da sua <span style={{ color: '#FA5858' }}>saudade</span> ?
      </Typography>

      <Typography variant='body2' color="text.secondary" sx={{ maxWidth: '600px', mb: 6, textAlign: 'center' }}>
        Comece a conversar com alguém que já se foi ou que você não vê há muito tempo...
      </Typography>
    </Box>
  );
};

export default ContentEmpty;