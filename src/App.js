import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/index';
import CssBaseline from '@mui/material/CssBaseline';
import { SocketProvider } from './contexts/SocketContext';
import { SessionProvider } from './contexts/SessionContext';
import { useMediaQuery } from '@mui/material';
import Home from './Home';
import Mobile from './Mobile';

function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <SocketProvider>
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          { isMobile ? <Mobile /> : <Home /> }
        </ThemeProvider>
      </SessionProvider>
    </SocketProvider>
  );
}

export default App;
