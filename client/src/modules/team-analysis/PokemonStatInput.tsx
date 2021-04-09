import {Box, Grid, TextField, Typography} from '@material-ui/core';
import {PokemonSet, StatName} from '@pkmn/data';
import React, {useContext} from 'react';

import {useSpecie} from '../../hooks/useSpecies';
import {GenerationContext} from '../generation/GenerationProvider';

import {PokemonAction, PokemonActionType} from './PokemonCard';

export interface PokemonStatInputProps {
  pokemon: PokemonSet;
  dispatch: React.Dispatch<PokemonAction>;
  stat: StatName;
  color: Record<number, string>;
}

export const PokemonStatInput: React.FC<PokemonStatInputProps> = ({
  pokemon,
  dispatch,
  stat,
  color,
}: PokemonStatInputProps) => {
  const {generation} = useContext(GenerationContext);
  const specie = useSpecie(pokemon.species);
  const ev = pokemon.evs[stat];
  const iv = pokemon.ivs[stat];
  const total =
    generation && specie
      ? generation.stats.calc(
          stat,
          specie.baseStats[stat],
          pokemon.ivs[stat],
          pokemon.evs[stat],
          pokemon.level,
          generation.natures.get(pokemon.nature)
        )
      : -1;

  return (
    <Box width="50px">
      <Grid
        container
        alignItems="flex-start"
        justify="flex-end"
        wrap="nowrap"
        direction="column"
      >
        <Grid item>
          <Typography variant="caption">
            {generation ? generation.stats.display(stat) : stat.toUpperCase()}
          </Typography>
        </Grid>

        <Grid item>
          <TextField
            value={ev}
            type="number"
            size="small"
            inputProps={{
              min: 0,
              max: 252,
              step: 4,
              style: {color: color[500], fontWeight: 'bold'},
            }}
            onChange={e =>
              dispatch({
                type: PokemonActionType.SET_EV,
                stat: stat,
                value: Number(e.currentTarget.value),
              })
            }
            fullWidth
          />
        </Grid>

        <Grid item>
          <TextField
            value={iv}
            type="number"
            size="small"
            inputProps={{
              min: 0,
              max: 31,
              style: {color: color[500], fontSize: '0.75rem'},
            }}
            onChange={e =>
              dispatch({
                type: PokemonActionType.SET_IV,
                stat: stat,
                value: Number(e.currentTarget.value),
              })
            }
            fullWidth
          />
        </Grid>

        <Grid item>
          <Typography variant="caption">{total}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
