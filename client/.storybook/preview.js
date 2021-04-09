import {ThemeProvider} from '@material-ui/core/styles';
import {addDecorator} from '@storybook/react';
import {themes} from '@storybook/theming';
import React from 'react';

import {GenerationProvider} from '../src/modules/generation/GenerationProvider';
import {Theme} from '../src/theme/Theme';

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  docs: {
    theme: themes.dark,
  },
};

addDecorator(story => (
  <ThemeProvider theme={Theme}>
    <GenerationProvider>{story()}</GenerationProvider>
  </ThemeProvider>
));
