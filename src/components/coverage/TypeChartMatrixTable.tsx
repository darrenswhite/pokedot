import React, {ReactElement, useEffect, useState} from 'react';
import {Grid, makeStyles} from '@material-ui/core';
import {TypeName} from '@pkmn/types';
import {PartialPokemonSet} from '../../info/PokeInfo';
import {Matrix} from '../../matrix/Matrix';
import {
  TypeChartMatrix,
  TypeChartMatrixProps,
} from '../../matrix/TypeChartMatrix';
import {PCol} from '../common/table/model/PCol';
import {PValue} from '../common/table/model/PRow';
import {PMatrixTable} from '../common/table/PMatrixTable';
import {EffectivenessChip} from './EffectivenessChip';
import {SpeciesImage} from './SpeciesImage';
import {TypeImage} from './TypeImage';

const renderCell = (
  key: keyof TypeChartMatrixProps
): ((params: PValue) => ReactElement) | undefined => {
  const render = getFieldRenderFunction(key);

  if (render) {
    return (value: PValue) => renderMultiValue(value, render);
  } else {
    return undefined;
  }
};

const renderHeader = (key: keyof TypeChartMatrixProps) => {
  const render = getFieldRenderFunction(key);

  return render ? (field: string) => render(field) : undefined;
};

const getFieldRenderFunction = (
  key: keyof TypeChartMatrixProps
): ((value: PValue) => ReactElement) | undefined => {
  let render;

  switch (key) {
    case 'species':
      render = renderSpecies;
      break;
    case 'type':
      render = renderType;
      break;
    case 'effectiveness':
      render = renderEffectiveness;
      break;
  }

  return render;
};

const renderMultiValue = (
  value: PValue | PValue[],
  render: (value: PValue) => ReactElement
): ReactElement => {
  if (value) {
    if (value instanceof Array) {
      return (
        <Grid container spacing={1}>
          {value.map((val, i) => (
            <Grid item key={i}>
              {render(val)}
            </Grid>
          ))}
        </Grid>
      );
    } else {
      return render(value);
    }
  } else {
    return <span />;
  }
};

const renderEffectiveness = (value: PValue): ReactElement => {
  return <EffectivenessChip value={Number(value)} />;
};

const renderSpecies = (value: PValue): ReactElement => {
  return <SpeciesImage name={value as string} />;
};

const renderType = (value: PValue): ReactElement => {
  return <TypeImage type={value as TypeName} />;
};

const useStyles = makeStyles(() => ({
  table: {
    maxHeight: 600,
  },
}));

export type TypeChartMatrixConstructor = (
  pokemonSets: PartialPokemonSet[]
) => Promise<TypeChartMatrix>;

export interface TypeChartMatrixTableProps {
  pokemonSets: PartialPokemonSet[];
  columnField: keyof TypeChartMatrixProps;
  idField: keyof TypeChartMatrixProps;
  valueField: keyof TypeChartMatrixProps;
  matrixConstructor: TypeChartMatrixConstructor;
}

export const TypeChartMatrixTable: React.FC<TypeChartMatrixTableProps> = ({
  pokemonSets,
  columnField,
  idField,
  valueField,
  matrixConstructor,
}: TypeChartMatrixTableProps) => {
  const classes = useStyles();
  const [matrix, setMatrix] = useState<Matrix<TypeChartMatrixProps>>(
    new Matrix<TypeChartMatrixProps>([])
  );
  const filteredMatrix = matrix.transform(values =>
    values.filter(val => val.effectiveness !== 1.0)
  );

  useEffect(() => {
    matrixConstructor(pokemonSets).then(setMatrix);
  }, [pokemonSets]);

  const columnFieldOverrides: Partial<PCol> = {
    renderCell: renderCell(columnField),
  };
  const idFieldOverrides: Partial<PCol> = {
    renderCell: renderCell(valueField),
    renderHeader: renderHeader(idField),
  };

  return (
    <PMatrixTable
      matrix={filteredMatrix}
      columnField={columnField}
      idField={idField}
      valueField={valueField}
      columnFieldOverrides={columnFieldOverrides}
      idFieldOverrides={idFieldOverrides}
      className={classes.table}
    />
  );
};
