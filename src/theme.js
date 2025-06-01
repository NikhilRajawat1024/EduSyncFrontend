import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5', // Indigo
      light: '#818CF8',
      dark: '#3730A3',
    },
    secondary: {
      main: '#7C3AED', // Purple
      light: '#A78BFA',
      dark: '#5B21B6',
    },
    background: {
      default: '#F3F4F6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1F2937',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1F2937',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1F2937',
    },
    body1: {
      fontSize: '1rem',
      color: '#4B5563',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

export default theme; 