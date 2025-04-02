import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/index';
import CssBaseline from '@mui/material/CssBaseline';
import { SocketProvider } from './contexts/SocketContext';
import { SessionProvider } from './contexts/SessionContext';
import Home from './Home';

function App() {

  return (
    <SocketProvider>
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Home />
        </ThemeProvider>
      </SessionProvider>
    </SocketProvider>
  );
}

export default App;
