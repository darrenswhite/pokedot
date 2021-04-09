import {Popper, TextField, Typography} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {PokemonSet} from '@pkmn/data';
import React, {useContext, useEffect, useState} from 'react';

import {useSpecie} from '../../hooks/useSpecies';
import {GenerationContext} from '../generation/GenerationProvider';

import {PokemonAction, PokemonActionType} from './PokemonCard';

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
  const {generation, stats} = useContext(GenerationContext);
  const specie = useSpecie(pokemon.species);
  const [moves, setMoves] = useState<Record<string, number>>({});
  const options = Object.entries(moves)
    .sort((left, right) => right[1] - left[1])
    .map(entry => entry[0]);
  const move = pokemon.moves[index];
  const nullableMove = move && move.length > 0 ? move : null;

  useEffect(() => {
    if (generation && specie) {
      const specieStats = stats.data[specie.name];
      const moveStats = specieStats?.Moves || {};
      const total = Object.values(moveStats).reduce(
        (total, curr) => total + curr,
        0
      );

      const moves = Object.fromEntries(
        Object.entries(generation.dex.data.Moves).map(([id, move]) => {
          const usage = moveStats[id] ?? 0;

          return [move.name, (usage / total) * 100];
        })
      );

      setMoves(moves);
    }
  }, [generation, specie, stats]);

  return (
    <Autocomplete
      options={options}
      value={nullableMove}
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
      renderOption={option => {
        let text = option;
        const percent = moves[option];

        if (percent) {
          text += ` (${percent.toFixed(2)}%)`;
        }

        return <Typography noWrap>{text}</Typography>;
      }}
      onChange={(_, value) =>
        dispatch({
          type: PokemonActionType.SET_MOVE,
          index,
          move: value ?? '',
        })
      }
      PopperComponent={params => (
        <Popper
          {...params}
          style={{width: 'fit-content'}}
          placement="bottom-start"
        />
      )}
      fullWidth
    />
  );
};
