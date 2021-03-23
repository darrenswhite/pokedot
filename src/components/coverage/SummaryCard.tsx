import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@material-ui/core';
import {TypeName} from '@pkmn/data';
import {flow, map, reduce, slice} from 'lodash/fp';
import {PartialPokemonSet} from '../../info/PokeInfo';
import {ResistanceMatrix} from './ResistanceMatrix';
import {TypeImage} from './TypeImage';

export interface SummaryCardProps {
  pokemonSets: PartialPokemonSet[];
}

const NUMBER_OF_WEAKNESSES = 3;

export const SummaryCard: React.FC<SummaryCardProps> = ({
  pokemonSets,
}: SummaryCardProps) => {
  const matrix = ResistanceMatrix.forPokemon(pokemonSets);
  const typeScores = matrix
    .scoreTypes(reduce((total, curr) => total * curr, 1))
    .sort((left, right) => (right[1] as number) - (left[1] as number));
  const weaknesses = flow(
    map((typeScore: [TypeName, number]) => typeScore[0]),
    slice(0, NUMBER_OF_WEAKNESSES)
  )(typeScores);

  return (
    <Card>
      <CardHeader title="Summary" />

      <CardContent>
        <Typography>Weaknesses</Typography>

        <Box my={1}>
          <Grid container spacing={1}>
            {weaknesses.map(type => (
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
