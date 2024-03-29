import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import {TypeName} from '@pkmn/types';
import {filter, flow, map, reduce, reject} from 'lodash/fp';
import React, {ReactElement, useContext, useEffect, useState} from 'react';

import {CoverageMatrix} from '../../pkmn/matrix/CoverageMatrix';
import {ResistanceMatrix} from '../../pkmn/matrix/ResistanceMatrix';
import {
  TypeChartMatrix,
  TypeChartMatrixProps,
} from '../../pkmn/matrix/TypeChartMatrix';
import {PartialPokemonSet} from '../../pkmn/PartialPokemonSet';
import {GenerationContext} from '../generation/GenerationProvider';
import {TypeImage} from '../species/TypeImage';

const EFFECTIVENESS_RESIST = [0.0, 0.25, 0.5];
const EFFECTIVENESS_SUPER = [2.0, 4.0];

const getMissingTypes = (
  matrix: TypeChartMatrix,
  types: TypeName[],
  effectiveness: number[]
): TypeName[] => {
  const resistedTypes = flow(
    filter((value: TypeChartMatrixProps) =>
      effectiveness.includes(value.effectiveness)
    ),
    map(value => value.type)
  )(matrix.values);

  return reject(type => resistedTypes.includes(type), types);
};

const getWeaknesses = (matrix: TypeChartMatrix): TypeName[] => {
  const typeScores = matrix
    .scoreTypes(reduce((total, curr) => total * curr, 1))
    .sort((left, right) => right[1] - left[1]);

  return flow(
    filter((typeScore: [TypeName, number]) => typeScore[1] > 1.0),
    map(typeScore => typeScore[0])
  )(typeScores);
};

const renderTypeList = (title: string, types: TypeName[]): ReactElement => {
  let result;

  if (types.length > 0) {
    result = (
      <Grid container spacing={1}>
        {types.map(type => (
          <Grid item key={type}>
            <TypeImage type={type} />
          </Grid>
        ))}
      </Grid>
    );
  } else {
    result = <span>None &#x1F44D;</span>;
  }

  return (
    <>
      <Typography variant="subtitle1">{title}</Typography>

      <Box my={1}>{result}</Box>
    </>
  );
};

export interface SummaryCardProps {
  pokemonSets: PartialPokemonSet[];
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  pokemonSets,
}: SummaryCardProps) => {
  const {generation} = useContext(GenerationContext);
  const [resistanceMatrix, setResistanceMatrix] = useState<ResistanceMatrix>(
    new ResistanceMatrix([])
  );
  const [coverageMatrix, setCoverageMatrix] = useState<CoverageMatrix>(
    new CoverageMatrix([])
  );
  const [types, setTypes] = useState<TypeName[]>([]);
  const defensiveMissingTypes = getMissingTypes(
    resistanceMatrix,
    types,
    EFFECTIVENESS_RESIST
  );
  const defensiveWeaknesses = getWeaknesses(resistanceMatrix);
  const offensiveMissingTypes = getMissingTypes(
    coverageMatrix,
    types,
    EFFECTIVENESS_SUPER
  );

  useEffect(() => {
    if (generation) {
      setResistanceMatrix(
        ResistanceMatrix.forPokemonSets(generation, pokemonSets)
      );
      setCoverageMatrix(CoverageMatrix.forPokemonSets(generation, pokemonSets));
      setTypes(Array.from(generation.types).map(type => type.name));
    }
  }, [generation, pokemonSets]);

  return (
    <Card>
      <CardHeader title="Summary" />

      <CardContent>
        {renderTypeList('Missing Defensive Coverage', defensiveMissingTypes)}
      </CardContent>

      <CardContent>
        {renderTypeList('Weak Defensive Coverage', defensiveWeaknesses)}
      </CardContent>

      <CardContent>
        {renderTypeList('Missing Offensive Coverage', offensiveMissingTypes)}
      </CardContent>
    </Card>
  );
};
