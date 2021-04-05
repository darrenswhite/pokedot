import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from '@material-ui/core';
import {Autocomplete, createFilterOptions} from '@material-ui/lab';
import {StatName} from '@pkmn/dex';
import {clone, range} from 'lodash/fp';
import React, {useEffect, useState} from 'react';

import {PartialPokemonSet, PokeInfo, STAT_NAMES} from '../../pkmn/PokeInfo';
import {SpeciesImage, SpeciesImageType} from '../species-info/SpeciesImage';

const renderMoveInput = (
  pokemon: PartialPokemonSet,
  info: PokeInfo,
  index: number,
  onUpdate: (pokemon: PartialPokemonSet) => void
) => {
  const moves = pokemon.moves ?? [];
  const filterOptions = createFilterOptions<string>({
    limit: 5,
  });
  const options = info.moves.map(move => move.name);
  const move = moves[index];
  const nullableMove = move && move.length > 0 ? moves[index] : null;

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
        onChange={(_, value: string | null) => {
          const newMoves = clone(moves);

          newMoves[index] = value ?? '';

          onUpdate({
            ...pokemon,
            moves: newMoves,
          });
        }}
        fullWidth
      />
    </Box>
  );
};

const renderStatInputs = (
  pokemon: PartialPokemonSet,
  statKey: StatName,
  statName: string,
  onUpdate: (pokemno: PartialPokemonSet) => void
) => {
  const updateStat = (value: string, key: 'evs' | 'ivs') => {
    const stat = Number(value);

    onUpdate({
      ...pokemon,
      [key]: {
        ...pokemon[key],
        [statKey]: stat,
      },
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
            value={pokemon.evs ? pokemon.evs[statKey] : 0}
            type="number"
            size="small"
            inputProps={{
              min: 0,
              max: 252,
            }}
            onChange={e => updateStat(e.currentTarget.value, 'evs')}
            fullWidth
          />
        </Box>
      </Grid>

      <Grid item>
        <Box width="40px">
          <TextField
            value={pokemon.ivs ? pokemon.ivs[statKey] : 31}
            type="number"
            size="small"
            inputProps={{
              min: 0,
              max: 31,
            }}
            onChange={e => updateStat(e.currentTarget.value, 'ivs')}
            fullWidth
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export interface PokemonCardProps {
  pokemon: PartialPokemonSet;
  onRemove: () => void;
  onUpdate: (pokemon: PartialPokemonSet) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onRemove,
  onUpdate,
}: PokemonCardProps) => {
  const [info, setInfo] = useState<PokeInfo | null>(null);
  let content;

  useEffect(() => {
    PokeInfo.forPokemonSet(pokemon).then(info => setInfo(info));
  }, [pokemon]);

  if (info) {
    content = (
      <Card>
        <CardHeader
          title={info.species}
          avatar={
            <SpeciesImage
              name={info.species}
              type={SpeciesImageType.ICON}
              moreInfo
            />
          }
        />

        <Grid container wrap="nowrap">
          <Grid item>
            <CardContent>
              <Grid container spacing={1}>
                {range(0, 2).map(index => (
                  <Grid key={index} item>
                    {renderMoveInput(pokemon, info, index, onUpdate)}
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={1}>
                {range(2, 4).map(index => (
                  <Grid key={index} item>
                    {renderMoveInput(pokemon, info, index, onUpdate)}
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Grid>

          <Grid item>
            <CardContent>
              <Grid container spacing={1} direction="column">
                {Object.entries(STAT_NAMES).map(([statKey, statName]) => (
                  <Grid key={statKey} item>
                    {renderStatInputs(
                      pokemon,
                      statKey as StatName,
                      statName,
                      onUpdate
                    )}
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Grid>
        </Grid>

        <CardActions>
          <Button size="small" color="primary" onClick={onRemove}>
            Remove
          </Button>
        </CardActions>
      </Card>
    );
  } else {
    content = <span />;
  }

  return content;
};
