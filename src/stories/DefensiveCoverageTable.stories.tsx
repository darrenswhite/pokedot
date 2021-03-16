import React from 'react';
import {Story} from '@storybook/react';
import {
  DefensiveTable,
  DefensiveTableProps,
} from '../components/coverage/DefensiveTable';
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
    rowField: 'resistance',
    valueField: 'type',
  },
  argTypes: {
    columnField: {
      control: {
        type: 'select',
        options: ['species', 'type', 'resistance'],
      },
    },
    rowField: {
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

const TheDefensiveTable: Story<DefensiveTableProps> = args => {
  return <DefensiveTable {...args} />;
};

const TheDefensiveCoverageTable: Story<DefensiveCoverageTableProps> = args => {
  return <DefensiveCoverageTable {...args} />;
};

export const Main = TheDefensiveTable.bind({});
export const Old = TheDefensiveCoverageTable.bind({});
