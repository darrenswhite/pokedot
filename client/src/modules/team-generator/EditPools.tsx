import {Button, Grid} from '@material-ui/core';
import React from 'react';

import {PoolOptions} from './PoolOptions';
import {Pool} from './TeamGeneratorState';

export interface EditPoolsProps {
  pools: Pool[];
  onBack: () => void;
  onChange: (index: number, recipe: (pool: Pool) => void) => void;
}

export const EditPools: React.FC<EditPoolsProps> = ({
  pools,
  onBack,
  onChange,
}: EditPoolsProps) => {
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{height: '100%'}}
    >
      <Grid item container justify="center" spacing={1}>
        <Grid item container justify="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
            {pools.map((pool, index) => (
              <PoolOptions
                key={index}
                pool={pool}
                onChange={recipe => onChange(index, recipe)}
                index={index}
              />
            ))}
          </Grid>
        </Grid>

        <Grid item container justify="center">
          <Grid item xs={12} sm={4} md={3} lg={2} xl={2}>
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
