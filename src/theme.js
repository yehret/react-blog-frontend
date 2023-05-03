import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  shadows: ['none', '0px 0px 0px rgba(0, 0, 0,0)', '0px 0px 0px rgba(0, 0, 0, 0)'],
  palette: {
    primary: {
      main: '#4361ee',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
});
