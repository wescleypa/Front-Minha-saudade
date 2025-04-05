import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import AdbIcon from '@mui/icons-material/Adb';

function MobileBar({ setPage }) {

  return (
    <AppBar position="fixed" sx={{ bgcolor: '#F7FAFC', boxShadow: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>


          <Box sx={{ flexGrow: 0 }}>
            <Button
              variant="outlined"
              size='small'
              color="primary"
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                px: 3,
                mr: 1
              }}
              onClick={() => setPage('login')}
            >
              Login
            </Button>

            <Button
              variant="contained"
              size='small'
              color="primary"
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                px: 3,
                backgroundColor: 'primary.dark',
                '&:hover': {
                  backgroundColor: '#38A169',
                }
              }}
              onClick={() => setPage('register')}
            >
              Registrar
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default MobileBar;
