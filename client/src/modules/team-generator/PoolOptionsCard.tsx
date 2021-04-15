import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';
import clsx from 'clsx';
import React, {useState} from 'react';

import {Pool} from './TeamGeneratorState';

const useStyles = makeStyles(theme => ({
  root: {
    width: 300,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

export interface PoolOptionsCardProps {
  pool: Pool;
  onChange: (recipe: (pool: Pool) => void) => void;
  index: number;
}

export const PoolOptionsCard: React.FC<PoolOptionsCardProps> = ({
  pool,
  onChange,
  index,
}: PoolOptionsCardProps) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => setExpanded(!expanded);

  return (
    <Card className={classes.root} raised>
      <CardHeader
        title={`Pool ${index + 1}`}
        action={
          <CardActions disableSpacing>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMore />
            </IconButton>
          </CardActions>
        }
      />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />

        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Typography id="fullyEvolved-switch">
                    Fully Evolved
                  </Typography>
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
        </CardContent>
      </Collapse>
    </Card>
  );
};
