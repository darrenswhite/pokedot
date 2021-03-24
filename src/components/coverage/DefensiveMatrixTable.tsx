import React, {ReactElement} from 'react';
import {Grid, makeStyles, Typography} from '@material-ui/core';
import {PartialPokemonSet} from '../../info/PokeInfo';
import {ResistanceChip} from './ResistanceChip';
import {
  ResistanceMatrix,
  ResistanceMatrixProps,
} from '../../matrix/ResistanceMatrix';
import {PCol} from '../common/table/model/PCol';
import {PValue} from '../common/table/model/PRow';
import {PMatrixTable} from '../common/table/PMatrixTable';
import {TypeImage} from './TypeImage';
import {TypeName} from '@pkmn/types';
import {SpeciesImage} from './SpeciesImage';

const renderCell = (
  key: keyof ResistanceMatrixProps
): ((params: PValue) => ReactElement) | undefined => {
  const render = getFieldRenderFunction(key);

  if (render) {
    return (value: PValue) => renderMultiValue(value, render);
  } else {
    return undefined;
  }
};

const renderHeader = (key: keyof ResistanceMatrixProps) => {
  const render = getFieldRenderFunction(key);

  return render ? (field: string) => render(field) : undefined;
};

const getFieldRenderFunction = (
  key: keyof ResistanceMatrixProps
): ((value: PValue) => ReactElement) | undefined => {
  let render;

  switch (key) {
    case 'species':
      render = renderSpecies;
      break;
    case 'type':
      render = renderType;
      break;
    case 'resistance':
      render = renderResistance;
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

const renderResistance = (value: PValue): ReactElement => {
  return <ResistanceChip value={Number(value)} />;
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

export interface DefensiveMatrixTableProps {
  pokemonSets: PartialPokemonSet[];
  columnField: keyof ResistanceMatrixProps;
  idField: keyof ResistanceMatrixProps;
  valueField: keyof ResistanceMatrixProps;
}

export const DefensiveMatrixTable: React.FC<DefensiveMatrixTableProps> = ({
  pokemonSets,
  columnField,
  idField,
  valueField,
}: DefensiveMatrixTableProps) => {
  const classes = useStyles();
  const matrix = new ResistanceMatrix(pokemonSets).transform(matrix =>
    matrix.filter(val => val.resistance !== 1.0)
  );
  const columnFieldOverrides: Partial<PCol> = {
    renderCell: renderCell(columnField),
  };
  const idFieldOverrides: Partial<PCol> = {
    renderCell: renderCell(valueField),
    renderHeader: renderHeader(idField),
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Defensive Coverage
      </Typography>

      <PMatrixTable
        matrix={matrix}
        columnField={columnField}
        idField={idField}
        valueField={valueField}
        columnFieldOverrides={columnFieldOverrides}
        idFieldOverrides={idFieldOverrides}
        className={classes.table}
      />
    </div>
  );
};
