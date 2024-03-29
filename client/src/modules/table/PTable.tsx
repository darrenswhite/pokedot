import {
  SxProps,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Theme,
} from '@mui/material';
import React, {ReactElement, useState} from 'react';

import {PCol} from './model/PCol';
import {PRow} from './model/PRow';
import {PSortDirection, PSortItem} from './model/PSort';
import {PCell} from './PCell';
import {PHeader} from './PHeader';
import {sortRows} from './PRowSorter';

const getCellValue = (col: PCol, row: PRow): ReactElement => {
  let result;
  const rawValue = row[col.field];
  const value = col.mapValue ? col.mapValue(rawValue) : rawValue;

  if (col.renderCell) {
    result = col.renderCell(value);
  } else {
    result = <span>{String(value)}</span>;
  }

  return result;
};

const getNextSortForItem = (
  field: string,
  sortItem: PSortItem | undefined
): PSortDirection => {
  const isCurrentSortField = sortItem?.field === field;
  let sort: PSortDirection;

  if (isCurrentSortField) {
    if (sortItem?.sort === 'asc') {
      sort = 'desc';
    } else if (sortItem?.sort === 'desc') {
      sort = undefined;
    } else {
      sort = 'asc';
    }
  } else {
    sort = 'asc';
  }

  return sort;
};

export interface PTableProps {
  columns: PCol[];
  rows: PRow[];
  sx?: SxProps<Theme>;
}

export const PTable: React.FC<PTableProps> = ({
  columns,
  rows,
  sx,
}: PTableProps) => {
  const [sortItem, setSortItem] = useState<PSortItem | undefined>();

  const handleRequestSort = (_: React.MouseEvent<unknown>, field: string) => {
    const sort = getNextSortForItem(field, sortItem);

    setSortItem({
      field,
      sort,
    });
  };

  return (
    <TableContainer sx={sx}>
      <Table size="small" stickyHeader style={{borderCollapse: 'collapse'}}>
        <PHeader
          columns={columns}
          sortItem={sortItem}
          onRequestSort={handleRequestSort}
        />

        <TableBody>
          {sortRows(rows, sortItem).map(row => {
            return (
              <TableRow tabIndex={-1} key={row.id}>
                {columns.map(col => {
                  return (
                    <PCell key={col.field} fixed={col.fixed} variant="body">
                      {getCellValue(col, row)}
                    </PCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
