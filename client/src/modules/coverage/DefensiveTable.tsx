import {Typography} from '@mui/material';
import React from 'react';

import {ResistanceMatrix} from '../../pkmn/matrix/ResistanceMatrix';
import {TypeChartMatrixProps} from '../../pkmn/matrix/TypeChartMatrix';
import {PartialPokemonSet} from '../../pkmn/PartialPokemonSet';

import {TypeChartTable} from './TypeChartTable';

export interface DefensiveTableProps {
  pokemonSets: PartialPokemonSet[];
  columnField: keyof TypeChartMatrixProps;
  idField: keyof TypeChartMatrixProps;
  valueField: keyof TypeChartMatrixProps;
}

export const DefensiveTable: React.FC<DefensiveTableProps> = ({
  pokemonSets,
  columnField,
  idField,
  valueField,
}: DefensiveTableProps) => {
  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Defensive Coverage
      </Typography>

      <TypeChartTable
        pokemonSets={pokemonSets}
        columnField={columnField}
        idField={idField}
        valueField={valueField}
        matrixConstructor={ResistanceMatrix.forPokemonSets.bind(this)}
      />
    </>
  );
};
