import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  makeStyles,
} from '@material-ui/core';
import {Check, Clear} from '@material-ui/icons';
import {every} from 'lodash/fp';
import React from 'react';

import {Player} from './TeamGeneratorState';

const useStyles = makeStyles(() => ({
  paper: {
    height: '100%',
  },
}));

export interface PlayerListProps {
  players: Player[];
  currentPool: number;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  currentPool,
}: PlayerListProps) => {
  const classes = useStyles();
  const allPlayersReady = every('ready', players);

  const isPlayerReady = (player: Player) => {
    let ready;

    if (allPlayersReady) {
      ready = player.team.length === currentPool;
    } else {
      ready = player.ready;
    }

    return ready;
  };

  return (
    <Box height="100%">
      <Paper className={classes.paper}>
        <List
          aria-labelledby="players-subheader"
          subheader={
            <ListSubheader id="players-subheader">Players</ListSubheader>
          }
        >
          <Divider />
          {players.map(player => (
            <ListItem key={player.id}>
              <ListItemIcon>
                {isPlayerReady(player) ? <Check /> : <Clear />}
              </ListItemIcon>
              <ListItemText>{player.name}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};
