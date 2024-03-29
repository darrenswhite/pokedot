import {Check, Clear} from '@mui/icons-material';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
} from '@mui/material';
import React, {useContext} from 'react';

import {TeamGeneratorContext} from '../TeamGeneratorProvider';
import {Player} from '../TeamGeneratorState';

export const PlayerList: React.FC = () => {
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
        dense
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
              sx={{
                textDecoration: 'line-through',
              }}
            >
              {player.name}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
