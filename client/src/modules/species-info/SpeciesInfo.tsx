import {Grid, Typography, colors, makeStyles} from '@material-ui/core';
import {StatName, StatsTable} from '@pkmn/types';
import React, {ReactElement} from 'react';

import {PokeInfo, STAT_NAMES} from '../../pkmn/PokeInfo';

import {SpeciesImage, SpeciesImageType} from './SpeciesImage';
import {TypeImage} from './TypeImage';

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

const renderHeader = (info: PokeInfo): ReactElement => {
  return (
    <>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="h5">
            #{info?.num} {info.species}
          </Typography>
        </Grid>
      </Grid>

      <Grid container justify="center">
        {info.types.map(type => (
          <Grid item key={type}>
            <TypeImage type={type} />
          </Grid>
        ))}
      </Grid>

      <Grid container justify="center">
        <Grid item>
          <SpeciesImage name={info.species} type={SpeciesImageType.SPRITE} />
        </Grid>
      </Grid>
    </>
  );
};

const renderStats = (
  info: PokeInfo,
  classes: ReturnType<typeof useStyles>
): ReactElement => {
  return (
    <>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="subtitle1">Base Stats</Typography>
        </Grid>
      </Grid>

      <Grid container justify="center" spacing={1}>
        <Grid item>
          {Object.keys(info.baseStats).map(stat => (
            <div key={stat} className={`${classes.stat} ${classes.statName}`}>
              {STAT_NAMES[stat as StatName]}
            </div>
          ))}
        </Grid>

        <Grid item xs>
          {Object.entries(info.baseStats).map(([stat, value]) => {
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

export interface SpeciesInfoProps {
  info: PokeInfo;
}

export const SpeciesInfo: React.FC<SpeciesInfoProps> = ({
  info,
}: SpeciesInfoProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid container justify="center" spacing={2}>
        <Grid item>{renderHeader(info)}</Grid>
        <Grid item>{renderStats(info, classes)}</Grid>
      </Grid>
    </>
  );
};
