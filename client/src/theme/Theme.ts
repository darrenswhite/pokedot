import {colors, createTheme} from '@material-ui/core';

export const Theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: colors.amber[700],
    },
  },
  typography: {
    fontFamily: 'Inter,sans-serif',
  },
});
