import React from 'react';
import {Typography} from '@material-ui/core';
import {PartialPokemonSet} from '../../pkmn/PokeInfo';
import {ResistanceMatrix} from '../../pkmn/matrix/ResistanceMatrix';
import {TypeChartMatrixProps} from '../../pkmn/matrix/TypeChartMatrix';
import {TypeChartMatrixTable} from './TypeChartMatrixTable';

export interface DefensiveMatrixTableProps {
  pokemonSets: PartialPokemonSet[];
  columnField: keyof TypeChartMatrixProps;
  idField: keyof TypeChartMatrixProps;
  valueField: keyof TypeChartMatrixProps;
}

export const DefensiveMatrixTable: React.FC<DefensiveMatrixTableProps> = ({
  pokemonSets,
  columnField,
  idField,
  valueField,
}: DefensiveMatrixTableProps) => {
  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Defensive Coverage
      </Typography>

      <TypeChartMatrixTable
        pokemonSets={pokemonSets}
        columnField={columnField}
        idField={idField}
        valueField={valueField}
        matrixConstructor={ResistanceMatrix.forPokemonSets}
      />
    </>
  );
};
