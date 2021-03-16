import {createMuiTheme} from '@material-ui/core';
import {colors} from '@material-ui/core';

export const Theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: colors.amber[800],
    },
  },
});
