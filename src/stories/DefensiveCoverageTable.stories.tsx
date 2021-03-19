import React from 'react';
import {Story} from '@storybook/react';
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
  },
};

const TheDefensiveCoverageTable: Story<DefensiveCoverageTableProps> = args => {
  return <DefensiveCoverageTable {...args} />;
};

export const Main = TheDefensiveCoverageTable.bind({});
