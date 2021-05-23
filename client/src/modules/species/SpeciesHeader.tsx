import {Button, Grid, Typography} from '@material-ui/core';
import {Specie} from '@pkmn/data';
import React from 'react';

import {SpeciesImage, SpeciesImageType} from './SpeciesImage';
import {TypeImage} from './TypeImage';

export interface SpeciesHeaderProps {
  specie: Specie;
}

export const SpeciesHeader: React.FC<SpeciesHeaderProps> = ({
  specie,
}: SpeciesHeaderProps) => {
  return (
    <>
      <Grid container justify="center" spacing={1}>
        <Grid item>
          <Typography variant="h6" align="center">
            #{specie.num}
          </Typography>
        </Grid>

        <Grid item>
          <Grid container direction="column" justify="center">
            <Grid item xs>
              <Typography variant="h5">{specie.baseSpecies}</Typography>
            </Grid>

            <Grid item xs>
              <Typography variant="subtitle1">{specie.forme}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container justify="center">
        <Grid item>
          <SpeciesImage name={specie.name} type={SpeciesImageType.SPRITE} />
        </Grid>
      </Grid>

      <Grid container justify="center">
        {specie.types.map(type => (
          <Grid item key={type}>
            <TypeImage type={type} />
          </Grid>
        ))}
      </Grid>

      <Grid container justify="center">
        <Grid item>
          <Button
            component="a"
            href={`https://bulbapedia.bulbagarden.net/wiki/${specie.baseSpecies}_(Pok%C3%A9mon)`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Bulbapedia
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
