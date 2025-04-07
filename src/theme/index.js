import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FA5858',
      light: '#81E6D9',
      dark: '#FE2E2E',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#805AD5', // Roxo
      light: '#B794F4',
      dark: '#6B46C1',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F7FAFC', // Cinza claro
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1A202C', // Preto
      secondary: '#4A5568', // Cinza escuro
      light: '#FFFFFF'
    },
    error: {
      main: '#E53E3E' // Vermelho
    },
    success: {
      main: '#48BB78' // Verde
    }
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      // fontSize: '2.5rem',
      fontWeight: 700
    },
    h2: {
      // fontSize: '2rem',
      fontWeight: 600
    },
    body1: {
      // fontSize: '1rem',
      lineHeight: 1.5
    }
  },
  components: {
    /*MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          padding: '8px 16px',
          fontWeight: 600
        }
      },
      variants: [
        {
          props: { variant: 'rounded' },
          style: {
            borderRadius: '24px'
          }
        }
      ]
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px'
          }
        }
      }
    }*/
  },
  /*shape: {
    borderRadius: 8
  }*/
});

export default theme;