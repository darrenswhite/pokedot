import {
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
import clsx from 'clsx';
import React, {useContext} from 'react';

import {TeamGeneratorContext} from '../TeamGeneratorProvider';
import {Player} from '../TeamGeneratorState';

const useStyles = makeStyles(() => ({
  disconnected: {
    textDecoration: 'line-through',
  },
}));

export const PlayerList: React.FC = () => {
  const classes = useStyles();
  const {state} = useContext(TeamGeneratorContext);
  const players = Object.values(state.players);

  const isPlayerReady = (player: Player) => {
    let ready;
    const currentPool = state.currentPool;

    if (currentPool !== -1) {
      ready =
        player.team.length === currentPool + 1 ||
        currentPool === state.options.pools.length;
    } else {
      ready = player.ready;
    }

    return ready;
  };

  return (
    <Paper style={{height: '100%'}}>
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

            <ListItemText
              className={clsx({[classes.disconnected]: !player.connected})}
            >
              {player.name}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
