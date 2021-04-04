import {CircularProgress, Grid, Typography} from '@material-ui/core';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import React from 'react';

import {useJoinRoom, useRoomListeners} from '../../hooks/useRoom';

const PlayerName = dynamic<unknown>(() =>
  import('./PlayerName').then(m => m.PlayerName)
);

const PlayerReady = dynamic<unknown>(() =>
  import('./PlayerReady').then(m => m.PlayerReady)
);

const PoolSelections = dynamic<unknown>(() =>
  import('./PoolSelections').then(m => m.PoolSelections)
);

const Summary = dynamic<unknown>(() =>
  import('./Summary').then(m => m.Summary)
);

export const RoomPage: React.FC = () => {
  const {query} = useRouter();
  const roomId = typeof query.roomId === 'string' ? query.roomId : '';
  const {isLoading, error, room, state} = useJoinRoom(roomId);
  const {currentPool, options, players} = state;
  const player = players[room.sessionId];
  const showPoolSelections = currentPool !== -1;
  const showSummary = currentPool === options?.teamSize;
  let content;

  useRoomListeners();

  if (error || isLoading || !player) {
    content = (
      <Grid
        container
        justify="center"
        alignContent="center"
        style={{height: '100%'}}
      >
        <Grid item>
          {error ? <Typography>{error}</Typography> : <CircularProgress />}
        </Grid>
      </Grid>
    );
  } else if (player.name === 'Anonymous') {
    content = <PlayerName />;
  } else if (showSummary) {
    content = <Summary />;
  } else if (showPoolSelections) {
    content = <PoolSelections />;
  } else {
    content = <PlayerReady />;
  }

  return content;
};
