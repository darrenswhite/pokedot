import {CssBaseline, ThemeProvider} from '@mui/material';
import {themes} from '@storybook/theming';
import React from 'react';

import {GenerationProvider} from '../src/modules/generation/GenerationProvider';
import {Theme} from '../src/theme/Theme';

const preview = {
  decorators: [
    Story => (
      <ThemeProvider theme={Theme}>
        <CssBaseline />

        <GenerationProvider>
          <Story />
        </GenerationProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    docs: {
      theme: themes.dark,
    },
  },
};

export default preview;
