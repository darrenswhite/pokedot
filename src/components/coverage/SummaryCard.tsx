import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@material-ui/core';
import {filter, flow, map, reduce, reject, slice} from 'lodash/fp';
import {PartialPokemonSet, PokeInfo} from '../../info/PokeInfo';
import {
  ResistanceMatrix,
  ResistanceMatrixProps,
} from '../../matrix/ResistanceMatrix';
import {TypeImage} from './TypeImage';

export interface SummaryCardProps {
  pokemonSets: PartialPokemonSet[];
}

const NUMBER_OF_WEAKNESSES = 3;

export const SummaryCard: React.FC<SummaryCardProps> = ({
  pokemonSets,
}: SummaryCardProps) => {
  const matrix = new ResistanceMatrix(pokemonSets);
  const resistedTypes = flow(
    filter((value: ResistanceMatrixProps) =>
      [0.0, 0.25, 0.5].includes(value.resistance)
    ),
    map(value => value.type)
  )(matrix.values);
  const unresistedTypes = reject(
    type => resistedTypes.includes(type),
    PokeInfo.typeNames()
  );
  const typeScores = matrix
    .scoreTypes(reduce((total, curr) => total * curr, 1))
    .sort((left, right) => (right[1] as number) - (left[1] as number));
  const weaknesses = slice(0, NUMBER_OF_WEAKNESSES, typeScores);

  return (
    <Card>
      <CardHeader title="Summary" />

      <CardContent>
        <Typography variant="subtitle1">Unresisted Types</Typography>

        <Box my={1}>
          <Grid container spacing={1}>
            {unresistedTypes.map(type => (
              <Grid item key={type}>
                <TypeImage type={type} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>

      <CardContent>
        <Typography variant="subtitle1">Weaknesses</Typography>

        <Box my={1}>
          <Grid container spacing={1}>
            {weaknesses.map(([type]) => (
              <Grid item key={type}>
                <TypeImage type={type} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
