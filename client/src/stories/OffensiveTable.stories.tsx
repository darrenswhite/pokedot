import {Story} from '@storybook/react';
import React from 'react';

import {
  OffensiveTable,
  OffensiveTableProps,
} from '../modules/coverage/OffensiveTable';

export default {
  title: 'OffensiveTable',
  component: OffensiveTable,
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

const TheOffensiveTable: Story<OffensiveTableProps> = args => {
  return <OffensiveTable {...args} />;
};

export const Main = TheOffensiveTable.bind({});
