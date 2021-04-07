import {Box, TextField} from '@material-ui/core';
import {Autocomplete, createFilterOptions} from '@material-ui/lab';
import {PokemonSet} from '@pkmn/dex-types';
import React from 'react';

import {PokeInfo} from '../../pkmn/PokeInfo';

export interface PokemonMoveInputProps {
  pokemon: PokemonSet;
  updatePokemonValue: (key: keyof PokemonSet, value: unknown) => void;
  info: PokeInfo;
  index: number;
}

export const PokemonMoveInput: React.FC<PokemonMoveInputProps> = ({
  pokemon,
  updatePokemonValue,
  info,
  index,
}: PokemonMoveInputProps) => {
  const moves = pokemon.moves;
  const filterOptions = createFilterOptions<string>({
    limit: 5,
  });
  const options = info.moves.map(move => move.name);
  const move = moves[index];
  const nullableMove = move && move.length > 0 ? moves[index] : null;

  const updateMove = (_: React.ChangeEvent<unknown>, value: string | null) => {
    updatePokemonValue('moves', [
      ...moves.slice(0, index),
      value ?? '',
      ...moves.slice(index + 1),
    ]);
  };

  return (
    <Box width="150px">
      <Autocomplete
        options={options}
        value={nullableMove}
        filterOptions={filterOptions}
        size="small"
        renderInput={params => (
          <TextField
            {...params}
            label={`Move #${index + 1}`}
            placeholder="Select a move"
            size="small"
            fullWidth
          />
        )}
        onChange={updateMove}
        fullWidth
      />
    </Box>
  );
};
