import {Popper, TextField, Typography} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {Generation, Move, PokemonSet, Specie} from '@pkmn/data';
import React, {useContext, useEffect, useState} from 'react';
import {UsageStatistics} from 'smogon';

import {useSpecie} from '../../hooks/useSpecies';
import {GenerationContext} from '../generation/GenerationProvider';

const getMoves = async (
  generation: Generation,
  specie: Specie,
  stats: UsageStatistics
): Promise<Record<string, number>> => {
  const specieStats = stats.data[specie.name];
  const moveStats = specieStats?.Moves || {};
  const total = Object.values(moveStats).reduce(
    (total, curr) => total + curr,
    0
  );
  const learnset = (await generation.learnsets.learnable(specie.id)) ?? {};
  const learnsetMoves = Object.keys(learnset)
    .map(moveId => generation.moves.get(moveId))
    .filter(move => !!move) as Move[];

  return Object.fromEntries(
    learnsetMoves.map(move => {
      const usage = moveStats[move.id] ?? 0;

      return [move.name, (usage / total) * 100];
    })
  );
};

export interface PokemonMoveInputProps {
  pokemon: PokemonSet;
  onChange: (recipe: (pokemon: PokemonSet) => void) => void;
  index: number;
}

export const PokemonMoveInput: React.FC<PokemonMoveInputProps> = ({
  pokemon,
  onChange,
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
      getMoves(generation, specie, stats)
        .then(setMoves)
        .catch(e => {
          console.error(`Failed to get moves for specie ${specie.name}.`, e);
        });
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
        onChange(pokemon => {
          pokemon.moves[index] = value ?? '';
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
