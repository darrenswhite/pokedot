import {Box, TextField} from '@material-ui/core';
import {Autocomplete, createFilterOptions} from '@material-ui/lab';
import {Generation, Move, PokemonSet, Specie} from '@pkmn/data';
import React, {useContext, useEffect, useState} from 'react';

import {useSpecie} from '../../hooks/useSpecies';
import {GenerationContext} from '../generation/GenerationProvider';

import {PokemonAction, PokemonActionType} from './PokemonCard';

const getMoves = async (
  generation: Generation,
  specie: Specie
): Promise<Move[]> => {
  const learnset = (await generation.learnsets.learnable(specie.id)) ?? {};
  const moveIds = Object.keys(learnset || {});

  return moveIds
    .map(moveId => generation.moves.get(moveId))
    .filter(move => !!move) as Move[];
};

export interface PokemonMoveInputProps {
  pokemon: PokemonSet;
  dispatch: React.Dispatch<PokemonAction>;
  index: number;
}

export const PokemonMoveInput: React.FC<PokemonMoveInputProps> = ({
  pokemon,
  dispatch,
  index,
}: PokemonMoveInputProps) => {
  const {generation} = useContext(GenerationContext);
  const specie = useSpecie(pokemon.species);
  const [moves, setMoves] = useState<Move[]>([]);
  const options = moves.map(move => move.name);
  const filterOptions = createFilterOptions<string>({
    limit: 5,
  });
  const move = pokemon.moves[index];
  const nullableMove = move && move.length > 0 ? move : null;

  useEffect(() => {
    if (generation && specie) {
      getMoves(generation, specie).then(setMoves);
    }
  }, [generation, specie]);

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
        onChange={(_, value) =>
          dispatch({
            type: PokemonActionType.SET_MOVE,
            index,
            move: value ?? '',
          })
        }
        fullWidth
      />
    </Box>
  );
};
