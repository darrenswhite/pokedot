import {Button, Grid} from '@mui/material';
import React from 'react';

import {PoolOptions} from './PoolOptions';
import {Pool} from './TeamGeneratorState';

export interface EditPoolsProps {
  pools: Pool[];
  onBack: () => void;
  onChange: (index: number, recipe: (pool: Pool) => void) => void;
  applyToAll: (pool: Pool) => void;
}

export const EditPools: React.FC<EditPoolsProps> = ({
  pools,
  onBack,
  onChange,
  applyToAll,
}: EditPoolsProps) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{height: '100%'}}
    >
      <Grid item container justifyContent="center" spacing={1}>
        <Grid item container justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            {pools.map((pool, index) => (
              <PoolOptions
                key={index}
                pool={pool}
                onChange={recipe => onChange(index, recipe)}
                index={index}
                applyToAll={() => applyToAll(pool)}
              />
            ))}
          </Grid>
        </Grid>

        <Grid item container justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Button
              onClick={onBack}
              variant="contained"
              color="primary"
              fullWidth
            >
              Done
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
