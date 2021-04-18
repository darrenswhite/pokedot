import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Grid,
  Slider,
  Switch,
  Theme,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';
import React from 'react';

import {
  DEFAULT_MAXIMUM_BASE_STAT_TOTAL,
  DEFAULT_MINIMUM_BASE_STAT_TOTAL,
} from './TeamGeneratorProvider';
import {Pool, getPoolOptionsDisplay} from './TeamGeneratorState';

const useStyles = makeStyles((theme: Theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

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
  const classes = useStyles();

  return (
    <Accordion TransitionProps={{unmountOnExit: true}}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography className={classes.heading}>
          {`Pool #${index + 1}`}
        </Typography>

        <Typography className={classes.secondaryHeading}>
          {getPoolOptionsDisplay(pool)}
        </Typography>
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
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Typography id="baseStatTotal-slider">
                  Base Stat Total
                </Typography>
              </Grid>

              <Grid item xs>
                <Slider
                  value={[pool.minimumBaseStatTotal, pool.maximumBaseStatTotal]}
                  onChange={(_, value) => {
                    const totals = value as number[];

                    onChange(pool => {
                      pool.minimumBaseStatTotal = totals[0] ?? 0;
                      pool.maximumBaseStatTotal = totals[1] ?? 0;
                    });
                  }}
                  aria-labelledby="baseStatTotal-slider"
                  valueLabelDisplay="auto"
                  step={50}
                  min={DEFAULT_MINIMUM_BASE_STAT_TOTAL}
                  max={DEFAULT_MAXIMUM_BASE_STAT_TOTAL}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
