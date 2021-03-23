import React from 'react';
import {Card, CardContent, CardHeader, Grid} from '@material-ui/core';
import {TypeName} from '@pkmn/data';
import {reduce} from 'lodash/fp';
import {PartialPokemonSet} from '../../info/PokeInfo';
import {ResistanceMatrix} from './ResistanceMatrix';
import {TypeImage} from './TypeImage';

export interface ResistCardProps {
  pokemonSets: PartialPokemonSet[];
}

export const ResistCard: React.FC<ResistCardProps> = ({
  pokemonSets,
}: ResistCardProps) => {
  const matrix = ResistanceMatrix.forPokemon(pokemonSets);
  const totals = matrix
    .scoreTypes(reduce((total, curr) => total * curr, 1))
    .sort((left, right) => (left[1] as number) - (right[1] as number));

  return (
    <Card>
      <CardHeader title="Resists" />

      <CardContent>
        <Grid container>
          {totals.slice(0, 3).map(([type]) => (
            <Grid item key={type}>
              <TypeImage type={type as TypeName} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
