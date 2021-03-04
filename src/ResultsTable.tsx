import React, {FC} from 'react';
import {
  Grid,
  makeStyles,
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

export type ResultsTableRow = {
  [key: string]: {
    value: React.ReactNode | string;
    sortValue: string | number;
  };
};

export interface ResultsTableHeader {
  id: keyof ResultsTableRow;
  label: string;
  align?: TableCellProps['align'];
  before?: React.ReactNode;
}

type Order = 'asc' | 'desc';

function descendingComparator(
  a: ResultsTableRow,
  b: ResultsTableRow,
  orderBy: keyof ResultsTableRow
) {
  let result;

  if (b[orderBy].sortValue < a[orderBy].sortValue) {
    result = -1;
  } else if (b[orderBy].sortValue > a[orderBy].sortValue) {
    result = 1;
  } else {
    result = 0;
  }

  return result;
}

function getComparator<Key extends keyof ResultsTableRow>(
  order: Order,
  orderBy: Key
): (a: ResultsTableRow, b: ResultsTableRow) => number {
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

const useHeaderStyles = makeStyles(() => ({
  label: {
    flexDirection: 'column',
  },
}));

function TableHeader({
  headers,
  onRequestSort,
  order,
  orderBy,
}: TableHeaderProps) {
  const classes = useHeaderStyles();
  const createSortHandler = (property: keyof ResultsTableRow) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map(header => {
          return (
            <TableCell
              key={header.id}
              align={header.align}
              sortDirection={orderBy === header.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === header.id}
                direction={orderBy === header.id ? order : 'asc'}
                onClick={createSortHandler(header.id)}
                className={classes.label}
              >
                {header.before}
                <span>{header.label}</span>
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

export const ResultsTable: FC<ResultsTableProps> = ({
  headers,
  rows,
}: ResultsTableProps) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof ResultsTableRow>(
    headers[0].id
  );

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
                          {row[header.id]?.value}
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
