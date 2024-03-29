import {Chip, Tooltip, colors} from '@mui/material';
import React from 'react';

export interface EffectivenessChipProps {
  value: number;
}

export const EffectivenessChip: React.FC<EffectivenessChipProps> = ({
  value,
}: EffectivenessChipProps) => {
  let backgroundColor;
  let color;
  let label;

  switch (value) {
    case 0.0:
      backgroundColor = colors.green[500];
      label = <>0&times;</>;
      break;
    case 0.25:
      backgroundColor = colors.teal[500];
      label = <>&frac14;&times;</>;
      break;
    case 0.5:
      color = colors.green[500];
      label = <>&frac12;&times;</>;
      break;
    case 1:
      break;
    case 2:
      color = colors.red[500];
      label = <>2&times;</>;
      break;
    case 4:
      backgroundColor = colors.red[500];
      label = <>4&times;</>;
      break;
    default:
      break;
  }

  return label ? (
    <Tooltip title={String(value)}>
      <Chip
        label={label}
        size="small"
        variant="outlined"
        sx={{
          backgroundColor: backgroundColor,
          color: color,
        }}
      />
    </Tooltip>
  ) : null;
};
