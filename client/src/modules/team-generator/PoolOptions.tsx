import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Switch,
  Typography,
} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';
import React from 'react';

import {Pool} from './TeamGeneratorState';

export interface PoolOptionsProps {
  pool: Pool;
  onChange: (recipe: (pool: Pool) => void) => void;
  index: number;
}

export const PoolOptions: React.FC<PoolOptionsProps> = ({
  pool,
  onChange,
  index,
}: PoolOptionsProps) => {
  return (
    <Accordion TransitionProps={{unmountOnExit: true}}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>{`Pool ${index + 1}`}</Typography>
      </AccordionSummary>

      <Divider />

      <AccordionDetails>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Typography id="fullyEvolved-switch">Fully Evolved</Typography>
              </Grid>

              <Grid item>
                <Switch
                  checked={pool.fullyEvolved}
                  onChange={(_, value) => {
                    onChange(pool => {
                      pool.fullyEvolved = value;
                    });
                  }}
                  color="primary"
                  aria-labelledby="fullyEvolved-switch"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Typography id="notFullyEvolved-switch">
                  Not Fully Evolved
                </Typography>
              </Grid>

              <Grid item>
                <Switch
                  checked={pool.notFullyEvolved}
                  onChange={(_, value) => {
                    onChange(pool => {
                      pool.notFullyEvolved = value;
                    });
                  }}
                  color="primary"
                  aria-labelledby="notFullyEvolved-switch"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Typography id="restrictedLegendaries-switch">
                  Restricted Legendaries
                </Typography>
              </Grid>

              <Grid item>
                <Switch
                  checked={pool.restrictedLegendaries}
                  onChange={(_, value) => {
                    onChange(pool => {
                      pool.restrictedLegendaries = value;
                    });
                  }}
                  color="primary"
                  aria-labelledby="restrictedLegendaries-switch"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Typography id="subLegendaries-switch">
                  Sub-Legendaries
                </Typography>
              </Grid>

              <Grid item>
                <Switch
                  checked={pool.subLegendaries}
                  onChange={(_, value) => {
                    onChange(pool => {
                      pool.subLegendaries = value;
                    });
                  }}
                  color="primary"
                  aria-labelledby="subLegendaries-switch"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Typography id="mythicals-switch">Mythicals</Typography>
              </Grid>

              <Grid item>
                <Switch
                  checked={pool.mythicals}
                  onChange={(_, value) => {
                    onChange(pool => {
                      pool.mythicals = value;
                    });
                  }}
                  color="primary"
                  aria-labelledby="mythicals-switch"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            Minimum Base Stat Total: X
          </Grid>

          <Grid item xs={12}>
            Maximum Base Stat Total: X
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
