import React, {ReactElement} from 'react';
import {Grid, makeStyles, Tooltip, Typography} from '@material-ui/core';
import {Icons} from '@pkmn/img';
import {flow, map, toLower, upperFirst} from 'lodash/fp';
import {PartialPokemonSet} from '../../info/PokeInfo';
import {ResistanceChip} from './ResistanceChip';
import {ResistanceMatrix, SpeciesTypeResistance} from './ResistanceMatrix';
import {PRow, PValue} from '../common/table/model/PRow';
import {PCol} from '../common/table/model/PCol';
import {PTable} from '../common/table/PTable';

const getFieldRenderFunction = (
  key: keyof SpeciesTypeResistance
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

const renderCell = (
  key: keyof SpeciesTypeResistance
): ((params: PValue) => ReactElement) | undefined => {
  const render = getFieldRenderFunction(key);

  if (render) {
    return (value: PValue) => renderMultiValue(value, render);
  } else {
    return undefined;
  }
};

const renderHeader = (key: keyof SpeciesTypeResistance) => {
  const render = getFieldRenderFunction(key);

  return render ? (field: string) => render(field) : undefined;
};

const renderMultiValue = (
  value: PValue | PValue[],
  render: (value: PValue) => ReactElement
): ReactElement => {
  if (value) {
    if (value instanceof Array) {
      return (
        <Grid container spacing={0}>
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
  return (
    <Tooltip title={value as string}>
      <span style={Icons.getPokemon(value as string).css} />
    </Tooltip>
  );
};

const renderType = (value: PValue): ReactElement => {
  return (
    <Tooltip title={value as string}>
      <img src={Icons.getType(value as string).url} />
    </Tooltip>
  );
};

const getColumns = (
  matrix: ResistanceMatrix,
  columnField: keyof SpeciesTypeResistance,
  rowField: keyof SpeciesTypeResistance,
  valueField: keyof SpeciesTypeResistance
): PCol[] => {
  const columnName = flow(toLower, upperFirst)(columnField);
  const columnColumn = {
    field: columnField,
    headerName: columnName,
    fixed: true,
    renderCell: renderCell(columnField),
  };
  const columnKeys = Object.keys(matrix.groupBy(rowField));
  const rowColumns: PCol[] = columnKeys.sort().map(key => ({
    field: key,
    renderCell: renderCell(valueField),
    renderHeader: renderHeader(rowField),
    mapValue: value =>
      map(val => (val as SpeciesTypeResistance)[valueField])(
        value as SpeciesTypeResistance[]
      ),
  }));

  return [columnColumn, ...rowColumns];
};

const getRows = (
  matrix: ResistanceMatrix,
  columnField: keyof SpeciesTypeResistance,
  rowField: keyof SpeciesTypeResistance
): PRow[] => {
  const groups = matrix.groupBy(columnField, rowField);

  return Object.entries(groups).map(([column, row]) => {
    return {
      id: column,
      [columnField]: column,
      ...row,
    };
  });
};

const useStyles = makeStyles(() => ({
  table: {
    maxHeight: 600,
  },
}));

export interface DefensiveTableProps {
  pokemonSets: PartialPokemonSet[];
  columnField: keyof SpeciesTypeResistance;
  rowField: keyof SpeciesTypeResistance;
  valueField: keyof SpeciesTypeResistance;
}

export const DefensiveTable: React.FC<DefensiveTableProps> = ({
  pokemonSets,
  columnField,
  rowField,
  valueField,
}: DefensiveTableProps) => {
  const classes = useStyles();
  const matrix = ResistanceMatrix.forPokemon(pokemonSets).transform(matrix =>
    matrix.filter(val => val.resistance !== 1.0)
  );
  const columns = getColumns(matrix, columnField, rowField, valueField);
  const rows = getRows(matrix, columnField, rowField);

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Defensive Coverage
      </Typography>

      <PTable rows={rows} columns={columns} className={classes.table} />
    </div>
  );
};
