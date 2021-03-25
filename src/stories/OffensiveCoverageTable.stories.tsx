import React from 'react';
import {Story} from '@storybook/react';
import {
  OffensiveMatrixTable,
  OffensiveMatrixTableProps,
} from '../modules/coverage/OffensiveMatrixTable';

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

const TheOffensiveMatrixTable: Story<OffensiveMatrixTableProps> = args => {
  return <OffensiveMatrixTable {...args} />;
};

export const Main = TheOffensiveMatrixTable.bind({});
