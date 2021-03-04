import React from 'react';
import {
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  TableSortLabel,
  makeStyles,
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

const useStyles = makeStyles(() => ({
  label: {
    flexDirection: 'column',
  },
}));

export const SortableTableHead: React.FC<SortableTableHeadProps> = ({
  cells,
  onRequestSort,
  order,
  orderBy,
}: SortableTableHeadProps) => {
  const classes = useStyles();
  const createSortHandler = (property: keyof SortableTableRow) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
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
                className={classes.label}
              >
                {cell.before}
                <span>{cell.label}</span>
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};
