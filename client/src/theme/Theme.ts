import {colors} from '@mui/material';
import {createTheme} from '@mui/material/styles';

export const Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.amber[700],
    },
  },
  typography: {
    fontFamily: 'Inter,sans-serif',
  },
});
