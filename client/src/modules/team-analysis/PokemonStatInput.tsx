import {Box, Grid, TextField} from '@material-ui/core';
import {PokemonSet, StatName} from '@pkmn/dex-types';
import React from 'react';

import {PokeInfo} from '../../pkmn/PokeInfo';

export interface PokemonStatInputProps {
  pokemon: PokemonSet;
  updatePokemonValue: (key: keyof PokemonSet, value: unknown) => void;
  info: PokeInfo;
  statKey: StatName;
  statName: string;
}

export const PokemonStatInput: React.FC<PokemonStatInputProps> = ({
  pokemon,
  updatePokemonValue,
  info,
  statKey,
  statName,
}: PokemonStatInputProps) => {
  const ev = pokemon.evs[statKey];
  const iv = pokemon.ivs[statKey];
  const total = info.statTotals[statKey];

  const updateStat = (key: 'evs' | 'ivs', value: string) => {
    const stat = Number(value) || 0;

    updatePokemonValue(key, {
      ...pokemon[key],
      [statKey]: stat,
    });
  };

  return (
    <Grid
      container
      alignItems="center"
      justify="flex-end"
      spacing={1}
      wrap="nowrap"
    >
      <Grid item>{statName}</Grid>

      <Grid item>
        <Box width="50px">
          <TextField
            value={ev}
            type="number"
            size="small"
            inputProps={{
              min: 0,
              max: 252,
            }}
            onChange={e => updateStat('evs', e.currentTarget.value)}
            fullWidth
          />
        </Box>
      </Grid>

      <Grid item>
        <Box width="40px">
          <TextField
            value={iv}
            type="number"
            size="small"
            inputProps={{
              min: 0,
              max: 31,
            }}
            onChange={e => updateStat('ivs', e.currentTarget.value)}
            fullWidth
          />
        </Box>
      </Grid>

      <Grid item>{total}</Grid>
    </Grid>
  );
};
