import {TableCell, makeStyles} from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

import {PSortDirection} from './model/PSort';

export interface PCellProps {
  children?: React.ReactNode;
  fixed?: boolean;
  sortDirection?: PSortDirection;
  variant?: 'head' | 'body' | 'footer';
}

const useStyle = makeStyles(theme => ({
  fixed: {
    position: 'sticky',
    left: 0,
    right: 0,
    zIndex: 2,
    background: theme.palette.background.default,
  },
  fixedHeader: {
    zIndex: 3,
  },
}));

export const PCell: React.FC<PCellProps> = ({
  children,
  fixed,
  sortDirection,
  variant,
}: PCellProps) => {
  const classes = useStyle();
  const fixedHeader = fixed && variant === 'head';

  return (
    <TableCell
      className={clsx({
        [classes.fixed]: fixed,
        [classes.fixedHeader]: fixedHeader,
      })}
      sortDirection={sortDirection}
      variant={variant}
    >
      {children}
    </TableCell>
  );
};
