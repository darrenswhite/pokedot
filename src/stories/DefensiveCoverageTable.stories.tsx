import React from 'react';
import {Story} from '@storybook/react';
import {
  DefensiveMatrixTable,
  DefensiveMatrixTableProps,
} from '../modules/coverage/DefensiveMatrixTable';

export default {
  title: 'DefensiveCoverageTable',
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
    pokemonSets: {
      control: {
        type: 'object',
      },
    },
    columnField: {
      control: {
        type: 'select',
        options: ['species', 'type', 'effectiveness'],
      },
    },
    idField: {
      control: {
        type: 'select',
        options: ['species', 'type', 'effectiveness'],
      },
    },
    valueField: {
      control: {
        type: 'select',
        options: ['species', 'type', 'effectiveness'],
      },
    },
  },
};

const TheDefensiveMatrixTable: Story<DefensiveMatrixTableProps> = args => {
  return <DefensiveMatrixTable {...args} />;
};

export const Main = TheDefensiveMatrixTable.bind({});
