import {Box, Grid, TextField, Typography} from '@material-ui/core';
import {PokemonSet, StatID} from '@pkmn/data';
import React, {useContext} from 'react';

import {useSpecie} from '../../hooks/useSpecies';
import {GenerationContext} from '../generation/GenerationProvider';

const MAX_TOTAL_EVS = 508;

export interface PokemonStatInputProps {
  pokemon: PokemonSet;
  onChange: (recipe: (pokemon: PokemonSet) => void) => void;
  stat: StatID;
  color: Record<number, string>;
}

export const PokemonStatInput: React.FC<PokemonStatInputProps> = ({
  pokemon,
  onChange,
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
  const evTotal = Object.values(pokemon.evs).reduce(
    (total, curr) => total + curr,
    0
  );
  const evRemaining = evTotal - ev;

  return (
    <Box width="50px">
      <Grid
        container
        alignItems="flex-start"
        justifyContent="flex-end"
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
              style: {
                color: color[500],
                fontWeight: 'bold',
              },
            }}
            onChange={e => {
              onChange(pokemon => {
                const value = Number(e.currentTarget.value);
                const newTotal = evRemaining + value;
                const remain = newTotal - MAX_TOTAL_EVS;
                const newEv = remain > 0 ? value - remain : value;

                pokemon.evs[stat] = newEv;
              });
            }}
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
              style: {
                color: color[500],
                fontSize: '0.75rem',
              },
            }}
            onChange={e =>
              onChange(pokemon => {
                pokemon.ivs[stat] = Number(e.currentTarget.value);
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
