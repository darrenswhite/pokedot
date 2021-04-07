import {Grid, Typography, colors, makeStyles} from '@material-ui/core';
import {Specie} from '@pkmn/data';
import {StatName, StatsTable} from '@pkmn/types';
import React, {useContext} from 'react';

import {GenerationContext} from '../generation/GenerationProvider';

const MAX_STAT = 255;
const STAT_COLORS: StatsTable<Record<number, string>> = {
  hp: colors.red,
  atk: colors.amber,
  def: colors.yellow,
  spa: colors.blue,
  spd: colors.green,
  spe: colors.purple,
};

const useStyles = makeStyles(theme => ({
  stat: {
    height: theme.spacing(3),
  },
  statName: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  statBarContainer: {
    display: 'flex',
    width: theme.spacing(20),
  },
  statValue: {
    marginLeft: theme.spacing(1),
  },
}));

export interface SpecieStatsProps {
  specie: Specie;
}

export const SpecieStats: React.FC<SpecieStatsProps> = ({
  specie,
}: SpecieStatsProps) => {
  const {generation} = useContext(GenerationContext);
  const classes = useStyles();

  return (
    <>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="subtitle1">Base Stats</Typography>
        </Grid>
      </Grid>

      <Grid container justify="center" spacing={1}>
        <Grid item>
          {Object.keys(specie.baseStats).map(stat => (
            <div key={stat} className={`${classes.stat} ${classes.statName}`}>
              {generation
                ? generation.stats.display(stat as StatName)
                : stat.toUpperCase()}
            </div>
          ))}
        </Grid>

        <Grid item xs>
          {Object.entries(specie.baseStats).map(([stat, value]) => {
            const width = (value / MAX_STAT) * 100;
            const backgroundColor = STAT_COLORS[stat as StatName][700];
            const backgroundColorLighter = STAT_COLORS[stat as StatName][300];

            return (
              <Grid key={stat} container alignItems="center" wrap="nowrap">
                <Grid
                  item
                  className={`${classes.stat} ${classes.statBarContainer}`}
                  style={{backgroundColor: backgroundColorLighter}}
                >
                  <div
                    style={{
                      backgroundColor,
                      width: `${width}%`,
                    }}
                  />
                </Grid>

                <Grid item className={classes.statValue}>
                  {value}
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </>
  );
};
