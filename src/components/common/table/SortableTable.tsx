import React from 'react';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import {Order, sortRows} from './Sort';
import {SortableTableHead, SortableTableHeadCell} from './SortableTableHead';

export interface SortableTableProps {
  headers: SortableTableHeadCell[];
  rows: SortableTableRow[];
}

export type SortableTableRow = {
  [key: string]: {
    value: React.ReactNode | string;
    sortValue: string | number;
  };
};

export const SortableTable: React.FC<SortableTableProps> = ({
  headers,
  rows,
}: SortableTableProps) => {
  const [order, setOrder] = React.useState<Order>(Order.ASCENDING);
  const [orderBy, setOrderBy] = React.useState<keyof SortableTableRow>(
    headers[0].id
  );

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof SortableTableRow
  ) => {
    const isAsc = orderBy === property && order === Order.ASCENDING;

    setOrder(isAsc ? Order.DESCENDING : Order.ASCENDING);
    setOrderBy(property);
  };

  return (
    <Grid item xs={12}>
      <TableContainer component={Paper}>
        <Table size="small">
          <SortableTableHead
            cells={headers}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />

          <TableBody>
            {sortRows(rows, order, orderBy).map((row, index) => {
              return (
                <TableRow tabIndex={-1} key={index}>
                  {headers.map(header => {
                    return (
                      <TableCell align={header.align} key={header.id}>
                        {row[header.id]?.value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
