import React from 'react';
import {
  Grid,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
import {Order} from './Sort';
import {SortableTableRow} from './SortableTable';

export interface SortableTableHeadCell {
  id: keyof SortableTableRow;
  label: string;
  align?: TableCellProps['align'];
  before?: React.ReactNode;
}

export interface SortableTableHeadProps {
  cells: SortableTableHeadCell[];
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof SortableTableRow
  ) => void;
  order: Order;
  orderBy: keyof SortableTableRow;
}

export const SortableTableHead: React.FC<SortableTableHeadProps> = ({
  cells,
  onRequestSort,
  order,
  orderBy,
}: SortableTableHeadProps) => {
  const createSortHandler = (property: keyof SortableTableRow) => (
    event: React.MouseEvent<unknown>
  ) => onRequestSort(event, property);

  const getCellLabel = (cell: SortableTableHeadCell): React.ReactNode => {
    let result;

    if (cell.label) {
      if (cell.before) {
        result = (
          <Grid container justify="center">
            <Grid item>{cell.before}</Grid>
            <Grid item>
              <span>{cell.label}</span>
            </Grid>
          </Grid>
        );
      } else {
        result = <span>{cell.label}</span>;
      }
    } else {
      result = cell.before;
    }

    return result;
  };

  return (
    <TableHead>
      <TableRow>
        {cells.map(cell => {
          return (
            <TableCell
              key={cell.id}
              align={cell.align}
              sortDirection={orderBy === cell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === cell.id}
                direction={orderBy === cell.id ? order : Order.ASCENDING}
                onClick={createSortHandler(cell.id)}
              >
                {getCellLabel(cell)}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};
