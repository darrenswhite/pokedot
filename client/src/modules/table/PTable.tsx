import React, {ReactElement, useState} from 'react';
import {Table, TableBody, TableContainer, TableRow} from '@material-ui/core';
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
    result = <span>{value}</span>;
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
  className?: string;
  style?: React.CSSProperties;
}

export const PTable: React.FC<PTableProps> = ({
  columns,
  rows,
  className,
  style,
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
    <TableContainer className={className} style={style}>
      <Table size="small" stickyHeader>
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
