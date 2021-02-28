import React, {FC} from 'react';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';

export interface ResultsTableProps {
  headers: ResultsTableHeader[];
  rows: ResultsTableRow[];
}

export type ResultsTableRow = {[key: string]: number | string};

export interface ResultsTableHeader {
  id: keyof ResultsTableRow;
  label: string;
  numeric: boolean;
  align?: TableCellProps['align'];
}

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  let result;

  if (b[orderBy] < a[orderBy]) {
    result = -1;
  } else if (b[orderBy] > a[orderBy]) {
    result = 1;
  } else {
    result = 0;
  }

  return result;
}

function getComparator<Key extends keyof ResultsTableRow>(
  order: Order,
  orderBy: Key
): (
  a: {[key in Key]: number | string},
  b: {[key in Key]: number | string}
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(
  array: ResultsTableRow[],
  comparator: (a: ResultsTableRow, b: ResultsTableRow) => number
) {
  const stabilizedThis = array.map(
    (el, index) => [el, index] as [ResultsTableRow, number]
  );

  stabilizedThis.sort((a, b) => {
    let result;
    const order = comparator(a[0], b[0]);

    if (order !== 0) {
      result = order;
    } else {
      result = a[1] - b[1];
    }

    return result;
  });

  return stabilizedThis.map(el => el[0]);
}

interface TableHeaderProps {
  headers: ResultsTableHeader[];
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ResultsTableRow
  ) => void;
  order: Order;
  orderBy: keyof ResultsTableRow;
}

function TableHeader({
  headers,
  onRequestSort,
  order,
  orderBy,
}: TableHeaderProps) {
  const createSortHandler = (property: keyof ResultsTableRow) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map(header => (
          <TableCell
            key={header.id}
            align={header.numeric ? 'right' : 'left'}
            sortDirection={orderBy === header.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === header.id}
              direction={orderBy === header.id ? order : 'asc'}
              onClick={createSortHandler(header.id)}
            >
              {header.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export const ResultsTable: FC<ResultsTableProps> = ({
  headers,
  rows,
}: ResultsTableProps) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof ResultsTableRow>('type');

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ResultsTableRow
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Grid item xs={12}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHeader
            headers={headers}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map(
              (row, index) => {
                return (
                  <TableRow tabIndex={-1} key={index}>
                    {headers.map(header => {
                      return (
                        <TableCell align={header.align} key={header.id}>
                          <span>{row[header.id]}</span>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};
