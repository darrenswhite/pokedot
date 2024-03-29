import {TableHead, TableRow, TableSortLabel} from '@mui/material';
import React, {ReactElement} from 'react';

import {PCol} from './model/PCol';
import {PSortItem} from './model/PSort';
import {PCell} from './PCell';

export interface PHeaderProps {
  columns: PCol[];
  sortItem: PSortItem | undefined;
  onRequestSort: (event: React.MouseEvent<unknown>, field: string) => void;
}

const getColumnLabel = (col: PCol): ReactElement => {
  let result;

  if (col.renderHeader) {
    result = col.renderHeader(col.field);
  } else if (col.headerName) {
    result = <span>{col.headerName}</span>;
  } else {
    result = <span />;
  }

  return result;
};

export const PHeader: React.FC<PHeaderProps> = ({
  columns,
  sortItem,
  onRequestSort,
}: PHeaderProps) => {
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) =>
      onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        {columns.map(col => {
          const sortDirection = sortItem?.sort;
          const sortActive = sortDirection && sortItem?.field === col.field;

          return (
            <PCell
              key={col.field}
              sortDirection={sortDirection}
              fixed={col.fixed}
              variant="head"
            >
              <TableSortLabel
                active={sortActive}
                direction={sortDirection}
                onClick={createSortHandler(col.field)}
              >
                {getColumnLabel(col)}
              </TableSortLabel>
            </PCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};
