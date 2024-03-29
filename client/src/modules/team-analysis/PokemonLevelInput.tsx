import {TextField} from '@mui/material';
import {PokemonSet} from '@pkmn/data';
import React from 'react';

export interface PokemonLevelInputProps {
  pokemon: PokemonSet;
  onChange: (recipe: (pokemon: PokemonSet) => void) => void;
}

export const PokemonLevelInput: React.FC<PokemonLevelInputProps> = ({
  pokemon,
  onChange,
}: PokemonLevelInputProps) => {
  return (
    <TextField
      value={pokemon.level}
      label="Level"
      type="number"
      size="small"
      inputProps={{
        min: 1,
        max: 100,
      }}
      onChange={e => {
        onChange(pokemon => {
          pokemon.level = Number(e.currentTarget.value);
        });
      }}
      fullWidth
      variant={'standard'}
      margin={'dense'}
    />
  );
};
