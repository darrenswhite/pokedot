import {Grid, Typography, colors, makeStyles} from '@material-ui/core';
import {Specie, StatName, StatsTable} from '@pkmn/data';
import React, {useContext} from 'react';

import {GenerationContext} from '../generation/GenerationProvider';

const MAX_STAT = 255;
const MAX_TOTAL = MAX_STAT * 6;
const STAT_COLORS: StatsTable<Record<number, string>> = {
  hp: colors.red,
  atk: colors.amber,
  def: colors.yellow,
  spa: colors.blue,
  spd: colors.green,
  spe: colors.purple,
};
const STAT_TOTAL_COLOR = colors.brown;

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
  const baseStatTotal = Object.values(specie.baseStats).reduce(
    (left, right) => left + right,
    0
  );

  const renderStatName = (name: string) => {
    return (
      <div className={`${classes.stat} ${classes.statName}`}>
        <Typography variant="caption">{name}</Typography>
      </div>
    );
  };

  const renderStatBar = (
    value: number,
    max: number,
    color: Record<number, string>
  ) => {
    const width = (value / max) * 100;

    return (
      <Grid container alignItems="center" wrap="nowrap">
        <Grid
          item
          className={`${classes.stat} ${classes.statBarContainer}`}
          style={{backgroundColor: color[300]}}
        >
          <div
            style={{
              backgroundColor: color[700],
              width: `${width}%`,
            }}
          />
        </Grid>

        <Grid item className={classes.statValue}>
          <Typography variant="caption">{value}</Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="subtitle1">Base Stats</Typography>
        </Grid>
      </Grid>

      <Grid container justify="center" spacing={1}>
        <Grid item>
          {Object.keys(specie.baseStats).map(stat => {
            return renderStatName(
              generation ? generation.stats.display(stat) : stat.toUpperCase()
            );
          })}

          {renderStatName('Total')}
        </Grid>

        <Grid item xs>
          {Object.entries(specie.baseStats).map(([stat, value]) => {
            return renderStatBar(
              value,
              MAX_STAT,
              STAT_COLORS[stat as StatName]
            );
          })}

          {renderStatBar(baseStatTotal, MAX_TOTAL, STAT_TOTAL_COLOR)}
        </Grid>
      </Grid>
    </>
  );
};
