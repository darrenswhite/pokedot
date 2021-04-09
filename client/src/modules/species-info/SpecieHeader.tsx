import {Button, Grid, Typography} from '@material-ui/core';
import {Specie} from '@pkmn/data';
import React from 'react';

import {SpeciesImage, SpeciesImageType} from './SpeciesImage';
import {TypeImage} from './TypeImage';

export interface SpecieHeaderProps {
  specie: Specie;
}

export const SpecieHeader: React.FC<SpecieHeaderProps> = ({
  specie,
}: SpecieHeaderProps) => {
  return (
    <>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="h5">
            #{specie?.num} {specie.name}
          </Typography>
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
          <SpeciesImage name={specie.name} type={SpeciesImageType.SPRITE} />
        </Grid>
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
