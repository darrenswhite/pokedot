import {Typography} from '@mui/material';
import React from 'react';

import {CoverageMatrix} from '../../pkmn/matrix/CoverageMatrix';
import {TypeChartMatrixProps} from '../../pkmn/matrix/TypeChartMatrix';
import {PartialPokemonSet} from '../../pkmn/PartialPokemonSet';

import {TypeChartTable} from './TypeChartTable';

export interface OffensiveTableProps {
  pokemonSets: PartialPokemonSet[];
  columnField: keyof TypeChartMatrixProps;
  idField: keyof TypeChartMatrixProps;
  valueField: keyof TypeChartMatrixProps;
}

export const OffensiveTable: React.FC<OffensiveTableProps> = ({
  pokemonSets,
  columnField,
  idField,
  valueField,
}: OffensiveTableProps) => {
  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Offensive Coverage
      </Typography>

      <TypeChartTable
        pokemonSets={pokemonSets}
        columnField={columnField}
        idField={idField}
        valueField={valueField}
        matrixConstructor={CoverageMatrix.forPokemonSets.bind(this)}
      />
    </>
  );
};
