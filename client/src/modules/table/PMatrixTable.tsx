import {Theme} from '@emotion/react';
import {SxProps} from '@mui/material';
import {flow, map, toLower, toString, upperFirst} from 'lodash/fp';
import React, {ReactElement} from 'react';

import {Matrix, MatrixValue} from '../../pkmn/matrix/Matrix';

import {PCol} from './model/PCol';
import {PRow, PValue} from './model/PRow';
import {PTable} from './PTable';

const sentenceCase = flow(toString, toLower, upperFirst);

const getColumns = <
  T extends MatrixValue,
  C extends keyof T,
  I extends keyof T,
  V extends keyof T
>(
  matrix: Matrix<T>,
  columnField: C,
  idField: I,
  valueField: V,
  columnFieldOverrides?: Partial<PCol>,
  idFieldOverrides?: Partial<PCol>
): PCol[] => {
  const columnColumn = {
    field: toString(columnField),
    headerName: sentenceCase(columnField),
    fixed: true,
    ...columnFieldOverrides,
  };
  const columnKeys = Object.keys(matrix.groupBy(idField));
  const rowColumns: PCol[] = columnKeys.sort().map(key => ({
    field: key,
    headerName: sentenceCase(key),
    mapValue: value => map((val: T) => val[valueField] as V)(value as T[]),
    ...idFieldOverrides,
  }));

  return [columnColumn, ...rowColumns];
};

const getRows = <T extends MatrixValue>(
  matrix: Matrix<T>,
  columnField: keyof T,
  idField: keyof T
): PRow[] => {
  const groups = matrix.groupBy(columnField, idField);

  return Object.entries(groups).map(([column, row]) => {
    return {
      id: column,
      [columnField]: column,
      ...(row as Record<string, PValue>),
    };
  });
};

export interface PMatrixTableProps<T extends MatrixValue> {
  matrix: Matrix<T> | T[];
  columnField: keyof T;
  idField: keyof T;
  valueField: keyof T;
  columnFieldOverrides?: Partial<PCol>;
  idFieldOverrides?: Partial<PCol>;
  sx?: SxProps<Theme>;
}

export function PMatrixTable<T extends MatrixValue>({
  matrix,
  columnField,
  idField,
  valueField,
  columnFieldOverrides,
  idFieldOverrides,
  sx,
}: PMatrixTableProps<T>): ReactElement {
  const actualMatrix =
    matrix instanceof Matrix ? matrix : new Matrix<T>(matrix);
  const columns = getColumns(
    actualMatrix,
    columnField,
    idField,
    valueField,
    columnFieldOverrides,
    idFieldOverrides
  );
  const rows = getRows(actualMatrix, columnField, idField);

  return <PTable rows={rows} columns={columns} sx={sx} />;
}
