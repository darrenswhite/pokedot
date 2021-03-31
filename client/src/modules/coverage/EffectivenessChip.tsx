import {Chip, Tooltip, colors, makeStyles} from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(() => ({
  zero: {
    backgroundColor: colors.green[500],
  },
  quarter: {
    backgroundColor: colors.teal[500],
  },
  half: {
    color: colors.green[500],
  },
  double: {
    color: colors.red[500],
  },
  quadruple: {
    backgroundColor: colors.red[500],
  },
}));

export interface EffectivenessChipProps {
  value: number;
}

export const EffectivenessChip: React.FC<EffectivenessChipProps> = ({
  value,
}: EffectivenessChipProps) => {
  const classes = useStyles();
  let label;

  switch (value) {
    case 0.0:
      label = <>0&times;</>;
      break;
    case 0.25:
      label = <>&frac14;&times;</>;
      break;
    case 0.5:
      label = <>&frac12;&times;</>;
      break;
    case 1:
      break;
    case 2:
      label = <>2&times;</>;
      break;
    case 4:
      label = <>4&times;</>;
      break;
    default:
      break;
  }

  return label ? (
    <Tooltip title={String(value)}>
      <Chip
        label={label}
        className={clsx({
          [classes.zero]: value === 0,
          [classes.quarter]: value === 0.25,
          [classes.half]: value === 0.5,
          [classes.double]: value === 2,
          [classes.quadruple]: value === 4,
        })}
        size="small"
        variant="outlined"
      />
    </Tooltip>
  ) : null;
};
