import {Box, TextField} from '@material-ui/core';
import {PokemonSet} from '@pkmn/dex-types';
import React from 'react';

export interface PokemonLevelInputProps {
  pokemon: PokemonSet;
  updatePokemonValue: (key: keyof PokemonSet, value: unknown) => void;
}

export const PokemonLevelInput: React.FC<PokemonLevelInputProps> = ({
  pokemon,
  updatePokemonValue,
}: PokemonLevelInputProps) => {
  const level = pokemon.level;

  return (
    <Box width="150px">
      <TextField
        value={level}
        label="Level"
        type="number"
        size="small"
        inputProps={{
          min: 1,
          max: 100,
        }}
        onChange={e =>
          updatePokemonValue('level', Number(e.currentTarget.value))
        }
        fullWidth
      />
    </Box>
  );
};
