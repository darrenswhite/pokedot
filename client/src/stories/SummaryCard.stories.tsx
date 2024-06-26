import {StoryFn} from '@storybook/react';
import React from 'react';

import {SummaryCard, SummaryCardProps} from '../modules/coverage/SummaryCard';

export default {
  title: 'SummaryCard',
  component: SummaryCard,
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
    showOffensiveSummary: true,
  },
};

const TheSummaryCard: StoryFn<SummaryCardProps> = args => {
  return <SummaryCard {...args} />;
};

export const Main = TheSummaryCard.bind({});
