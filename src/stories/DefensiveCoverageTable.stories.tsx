import React from 'react';
import {Story} from '@storybook/react';
import {
  DefensiveMatrixTable,
  DefensiveMatrixTableProps,
} from '../components/coverage/DefensiveMatrixTable';
import {
  DefensiveCoverageTable,
  DefensiveCoverageTableProps,
} from '../components/team/DefensiveCoverageTable';

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
    idField: 'resistance',
    valueField: 'type',
  },
  argTypes: {
    columnField: {
      control: {
        type: 'select',
        options: ['species', 'type', 'resistance'],
      },
    },
    idField: {
      control: {
        type: 'select',
        options: ['species', 'type', 'resistance'],
      },
    },
    valueField: {
      control: {
        type: 'select',
        options: ['species', 'type', 'resistance'],
      },
    },
  },
};

const TheDefensiveMatrixTable: Story<DefensiveMatrixTableProps> = args => {
  return <DefensiveMatrixTable {...args} />;
};

const TheDefensiveCoverageTable: Story<DefensiveCoverageTableProps> = args => {
  return <DefensiveCoverageTable {...args} />;
};

export const Main = TheDefensiveMatrixTable.bind({});
export const Old = TheDefensiveCoverageTable.bind({});
