import React from 'react';
import {Story} from '@storybook/react';
import {
  OffensiveCoverageTable,
  OffensiveCoverageTableProps,
} from '../components/team/OffensiveCoverageTable';

export default {
  title: 'OffensiveCoverageTable',
  args: {
    pokemonSets: [
      {
        species: 'Venusaur',
        moves: ['Earth Power', 'Leaf Storm', 'Sleep Powder', 'Sludge Bomb'],
      },
      {
        species: 'Corviknight',
        moves: ['Brace Bird', 'Bulk Up', 'Iron Head', 'Roost'],
      },
      {
        species: 'Dusclops',
        moves: ['Bulldoze', 'Pain Split', 'Trick Room', 'Will-O-Wisp'],
      },
      {
        species: 'Gastrodon',
        moves: ['Earth Power', 'Protect', 'Recover', 'Scald'],
      },
      {
        species: 'Raichu',
        moves: ['Brick Break', 'Fake Out', 'Nuzzle', 'Volt Switch'],
      },
      {
        species: 'Togekiss',
        moves: ['Air Slash', 'Dazzling Gleam', 'Heat Wave', 'Protect'],
      },
    ],
  },
};

const TheOffensiveCoverageTable: Story<OffensiveCoverageTableProps> = args => {
  return <OffensiveCoverageTable {...args} />;
};

export const Main = TheOffensiveCoverageTable.bind({});