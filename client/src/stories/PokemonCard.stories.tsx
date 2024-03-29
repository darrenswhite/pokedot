import {StoryFn} from '@storybook/react';
import React from 'react';

import {
  PokemonCard,
  PokemonCardProps,
} from '../modules/team-analysis/PokemonCard';

export default {
  title: 'PokemonCard',
  component: PokemonCard,
  args: {
    pokemon: {
      name: '',
      species: 'Venusaur',
      item: 'Coba Berry',
      ability: 'Chlorophyll',
      moves: ['Earth Power', 'Sleep Powder', 'Sludge Bomb', 'Weather Ball'],
      nature: 'Timid',
      gender: '',
      evs: {
        hp: 4,
        atk: 0,
        def: 0,
        spa: 252,
        spd: 0,
        spe: 252,
      },
      ivs: {
        hp: 31,
        atk: 0,
        def: 31,
        spa: 31,
        spd: 31,
        spe: 31,
      },
      level: 50,
      shiny: true,
      happiness: 255,
      pokeball: '',
      hpType: '',
      gigantamax: false,
    },
  },
};

const ThePokemonCard: StoryFn<PokemonCardProps> = args => {
  return <PokemonCard {...args} />;
};

export const Main = ThePokemonCard.bind({});
