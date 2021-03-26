import React from 'react';
import {Typography} from '@material-ui/core';
import {PartialPokemonSet} from '../../pkmn/PokeInfo';
import {CoverageMatrix} from '../../pkmn/matrix/CoverageMatrix';
import {TypeChartMatrixProps} from '../../pkmn/matrix/TypeChartMatrix';
import {TypeChartMatrixTable} from './TypeChartMatrixTable';

export interface OffensiveMatrixTableProps {
  pokemonSets: PartialPokemonSet[];
  columnField: keyof TypeChartMatrixProps;
  idField: keyof TypeChartMatrixProps;
  valueField: keyof TypeChartMatrixProps;
}

export const OffensiveMatrixTable: React.FC<OffensiveMatrixTableProps> = ({
  pokemonSets,
  columnField,
  idField,
  valueField,
}: OffensiveMatrixTableProps) => {
  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Offensive Coverage
      </Typography>

      <TypeChartMatrixTable
        pokemonSets={pokemonSets}
        columnField={columnField}
        idField={idField}
        valueField={valueField}
        matrixConstructor={CoverageMatrix.forPokemonSets}
      />
    </>
  );
};
