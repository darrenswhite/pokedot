import React, {ReactElement} from 'react';
import {flow, map, toLower, toString, upperFirst} from 'lodash/fp';
import {Matrix, MatrixValue} from '../../matrix/Matrix';
import {PRow, PValue} from './model/PRow';
import {PCol} from './model/PCol';
import {PTable} from './PTable';

const getColumns = <T extends MatrixValue>(
  matrix: Matrix<T>,
  columnField: keyof T,
  idField: keyof T,
  valueField: keyof T,
  columnFieldOverrides?: Partial<PCol>,
  idFieldOverrides?: Partial<PCol>
): PCol[] => {
  const columnName = flow(toString, toLower, upperFirst)(columnField);
  const columnColumn = {
    field: toString(columnField),
    headerName: columnName,
    fixed: true,
    ...columnFieldOverrides,
  };
  const columnKeys = Object.keys(matrix.groupBy(idField));
  const rowColumns: PCol[] = columnKeys.sort().map(key => ({
    field: key,
    mapValue: value => map(val => (val as T)[valueField])(value as T[]),
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
  className?: string;
  style?: React.CSSProperties;
}

export function PMatrixTable<T extends MatrixValue>({
  matrix,
  columnField,
  idField,
  valueField,
  columnFieldOverrides,
  idFieldOverrides,
  className,
  style,
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

  return (
    <PTable rows={rows} columns={columns} className={className} style={style} />
  );
}
