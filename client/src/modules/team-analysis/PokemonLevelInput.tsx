import {Box, TextField} from '@material-ui/core';
import {PokemonSet} from '@pkmn/data';
import React from 'react';

import {PokemonAction, PokemonActionType} from './PokemonCard';

export interface PokemonLevelInputProps {
  pokemon: PokemonSet;
  dispatch: React.Dispatch<PokemonAction>;
}

export const PokemonLevelInput: React.FC<PokemonLevelInputProps> = ({
  pokemon,
  dispatch,
}: PokemonLevelInputProps) => {
  return (
    <Box width="150px">
      <TextField
        value={pokemon.level}
        label="Level"
        type="number"
        size="small"
        inputProps={{
          min: 1,
          max: 100,
        }}
        onChange={e =>
          dispatch({
            type: PokemonActionType.SET_LEVEL,
            level: Number(e.currentTarget.value),
          })
        }
        fullWidth
      />
    </Box>
  );
};
