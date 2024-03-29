import {TableCell, useTheme} from '@mui/material';
import React from 'react';

import {PSortDirection} from './model/PSort';

export interface PCellProps {
  children?: React.ReactNode;
  fixed?: boolean;
  sortDirection?: PSortDirection;
  variant?: 'head' | 'body' | 'footer';
}

export const PCell: React.FC<PCellProps> = ({
  children,
  fixed,
  sortDirection,
  variant,
}: PCellProps) => {
  const theme = useTheme();
  const fixedHeader = fixed && variant === 'head';

  return (
    <TableCell
      sortDirection={sortDirection}
      variant={variant}
      sx={{
        position: fixed ? 'sticky' : undefined,
        left: fixed ? 0 : undefined,
        right: fixed ? 0 : undefined,
        zIndex: fixedHeader ? 3 : fixed ? 2 : undefined,
        background: fixed ? theme.palette.background.default : undefined,
      }}
    >
      {children}
    </TableCell>
  );
};
