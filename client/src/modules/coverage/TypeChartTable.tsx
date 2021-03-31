import React, {ReactElement, useEffect, useState} from 'react';
import {Grid, makeStyles} from '@material-ui/core';
import {TypeName} from '@pkmn/types';
import {PartialPokemonSet} from '../../pkmn/PokeInfo';
import {Matrix} from '../../pkmn/matrix/Matrix';
import {
  TypeChartMatrix,
  TypeChartMatrixProps,
} from '../../pkmn/matrix/TypeChartMatrix';
import {PCol} from '../table/model/PCol';
import {PValue} from '../table/model/PRow';
import {PMatrixTable} from '../table/PMatrixTable';
import {EffectivenessChip} from './EffectivenessChip';
import {SpeciesImage} from '../pokemon-info/SpeciesImage';
import {TypeImage} from '../pokemon-info/TypeImage';

const renderCell = (
  key: keyof TypeChartMatrixProps
): ((value: PValue) => ReactElement) | undefined => {
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
  return <SpeciesImage name={value as string} moreInfo />;
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

export interface TypeChartTableProps {
  pokemonSets: PartialPokemonSet[];
  columnField: keyof TypeChartMatrixProps;
  idField: keyof TypeChartMatrixProps;
  valueField: keyof TypeChartMatrixProps;
  matrixConstructor: TypeChartMatrixConstructor;
}

export const TypeChartTable: React.FC<TypeChartTableProps> = ({
  pokemonSets,
  columnField,
  idField,
  valueField,
  matrixConstructor,
}: TypeChartTableProps) => {
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
