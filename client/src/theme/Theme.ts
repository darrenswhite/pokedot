import {colors, createMuiTheme} from '@material-ui/core';

export const Theme = createMuiTheme({
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
