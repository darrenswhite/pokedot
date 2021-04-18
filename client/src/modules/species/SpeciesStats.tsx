import {Grid, Typography, colors, makeStyles} from '@material-ui/core';
import {Specie, StatID, StatsTable} from '@pkmn/data';
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

export interface SpeciesStatsProps {
  specie: Specie;
}

export const SpeciesStats: React.FC<SpeciesStatsProps> = ({
  specie,
}: SpeciesStatsProps) => {
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
          {Object.keys(specie.baseStats).map(stat => (
            <React.Fragment key={stat}>
              {renderStatName(
                generation ? generation.stats.display(stat) : stat.toUpperCase()
              )}
            </React.Fragment>
          ))}

          {renderStatName('Total')}
        </Grid>

        <Grid item xs>
          {Object.entries(specie.baseStats).map(([stat, value]) => (
            <React.Fragment key={stat}>
              {renderStatBar(value, MAX_STAT, STAT_COLORS[stat as StatID])}
            </React.Fragment>
          ))}

          {renderStatBar(baseStatTotal, MAX_TOTAL, STAT_TOTAL_COLOR)}
        </Grid>
      </Grid>
    </>
  );
};
