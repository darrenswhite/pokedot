import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
} from '@material-ui/core';
import {PokemonSet, StatName} from '@pkmn/dex-types';
import React, {useEffect, useState} from 'react';

import {PokeInfo, STAT_NAMES} from '../../pkmn/PokeInfo';
import {SpeciesImage, SpeciesImageType} from '../species-info/SpeciesImage';

import {PokemonLevelInput} from './PokemonLevelInput';
import {PokemonMoveInput} from './PokemonMoveInput';
import {PokemonStatInput} from './PokemonStatInput';

export interface PokemonCardProps {
  pokemon: PokemonSet;
  onRemove: () => void;
  onUpdate: (pokemon: PokemonSet) => void;
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

  const updatePokemonValue = (key: keyof PokemonSet, value: unknown) => {
    onUpdate({
      ...pokemon,
      [key]: value,
    });
  };

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
              <PokemonLevelInput
                pokemon={pokemon}
                updatePokemonValue={updatePokemonValue}
              />

              <Grid container spacing={1}>
                <Grid item>
                  <PokemonMoveInput
                    pokemon={pokemon}
                    updatePokemonValue={updatePokemonValue}
                    info={info}
                    index={0}
                  />
                </Grid>

                <Grid item>
                  <PokemonMoveInput
                    pokemon={pokemon}
                    updatePokemonValue={updatePokemonValue}
                    info={info}
                    index={1}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item>
                  <PokemonMoveInput
                    pokemon={pokemon}
                    updatePokemonValue={updatePokemonValue}
                    info={info}
                    index={2}
                  />
                </Grid>

                <Grid item>
                  <PokemonMoveInput
                    pokemon={pokemon}
                    updatePokemonValue={updatePokemonValue}
                    info={info}
                    index={3}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Grid>

          <Grid item>
            <CardContent>
              <Grid container spacing={1} direction="column">
                {Object.entries(STAT_NAMES).map(([statKey, statName]) => (
                  <Grid key={statKey} item>
                    <PokemonStatInput
                      pokemon={pokemon}
                      updatePokemonValue={updatePokemonValue}
                      info={info}
                      statKey={statKey as StatName}
                      statName={statName}
                    />
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
