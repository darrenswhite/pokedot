import {Box, Grid, TextField} from '@material-ui/core';
import {PokemonSet, StatName} from '@pkmn/data';
import React, {useContext} from 'react';

import {useSpecie} from '../../hooks/useSpecies';
import {GenerationContext} from '../generation/GenerationProvider';

import {PokemonAction, PokemonActionType} from './PokemonCard';

export interface PokemonStatInputProps {
  pokemon: PokemonSet;
  dispatch: React.Dispatch<PokemonAction>;
  stat: StatName;
}

export const PokemonStatInput: React.FC<PokemonStatInputProps> = ({
  pokemon,
  dispatch,
  stat,
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
          {generation ? generation.stats.display(stat) : stat.toUpperCase()}
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

        <Grid item>{total}</Grid>
      </Grid>
    </Box>
  );
};
