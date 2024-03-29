import {StoryFn} from '@storybook/react';
import React from 'react';

import {
  DefensiveTable,
  DefensiveTableProps,
} from '../modules/coverage/DefensiveTable';

export default {
  title: 'DefensiveTable',
  component: DefensiveTable,
  args: {
    pokemonSets: [
      {
        species: 'Venusaur',
      },
      {
        species: 'Corviknight',
      },
      {
        species: 'Dusclops',
      },
      {
        species: 'Gastrodon',
        ability: 'Storm Drain',
      },
      {
        species: 'Raichu',
        ability: 'Lightning Rod',
      },
      {
        species: 'Togekiss',
      },
    ],
    columnField: 'species',
    idField: 'effectiveness',
    valueField: 'type',
  },
  argTypes: {
    columnField: {
      control: {
        type: 'select',
      },
      options: ['species', 'type', 'effectiveness'],
    },
    idField: {
      control: {
        type: 'select',
      },
      options: ['species', 'type', 'effectiveness'],
    },
    valueField: {
      control: {
        type: 'select',
      },
      options: ['species', 'type', 'effectiveness'],
    },
  },
};

const TheDefensiveTable: StoryFn<DefensiveTableProps> = args => {
  return <DefensiveTable {...args} />;
};

export const Main = TheDefensiveTable.bind({});
