import {Grid, makeStyles} from '@material-ui/core';
import {Generation} from '@pkmn/data';
import {TypeName} from '@pkmn/types';
import React, {ReactElement, useContext, useEffect, useState} from 'react';

import {Matrix} from '../../pkmn/matrix/Matrix';
import {
  TypeChartMatrix,
  TypeChartMatrixProps,
} from '../../pkmn/matrix/TypeChartMatrix';
import {PartialPokemonSet} from '../../pkmn/PartialPokemonSet';
import {GenerationContext} from '../generation/GenerationProvider';
import {SpeciesImage, SpeciesImageType} from '../species-info/SpeciesImage';
import {TypeImage} from '../species-info/TypeImage';
import {PCol} from '../table/model/PCol';
import {PValue} from '../table/model/PRow';
import {PMatrixTable} from '../table/PMatrixTable';

import {EffectivenessChip} from './EffectivenessChip';

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
  return (
    <SpeciesImage
      name={value as string}
      type={SpeciesImageType.ICON}
      moreInfo
      showTooltip
    />
  );
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
  generation: Generation,
  pokemonSets: PartialPokemonSet[]
) => TypeChartMatrix;

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
  const {generation} = useContext(GenerationContext);
  const classes = useStyles();
  const [matrix, setMatrix] = useState<Matrix<TypeChartMatrixProps>>(
    new Matrix<TypeChartMatrixProps>([])
  );
  const filteredMatrix = matrix.transform(values =>
    values.filter(val => val.effectiveness !== 1.0)
  );

  useEffect(() => {
    if (generation) {
      setMatrix(matrixConstructor(generation, pokemonSets));
    }
  }, [matrixConstructor, generation, pokemonSets]);

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
