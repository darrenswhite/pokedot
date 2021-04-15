import {CircularProgress, Grid, Typography} from '@material-ui/core';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import React from 'react';

import {useJoinRoom, useRoomListeners} from '../../hooks/useRoom';

const PlayerName = dynamic<unknown>(
  () => import('./PlayerName').then(m => m.PlayerName),
  {
    ssr: false,
  }
);

const PlayerReady = dynamic<unknown>(
  () => import('./PlayerReady').then(m => m.PlayerReady),
  {
    ssr: false,
  }
);

const PoolSelections = dynamic<unknown>(
  () => import('./PoolSelections').then(m => m.PoolSelections),
  {
    ssr: false,
  }
);

const Summary = dynamic<unknown>(
  () => import('./Summary').then(m => m.Summary),
  {
    ssr: false,
  }
);

export const RoomPage: React.FC = () => {
  const {query} = useRouter();
  const roomId = typeof query.roomId === 'string' ? query.roomId : '';
  const {isLoading, error, room, state} = useJoinRoom(roomId);
  const {currentPool, options, players} = state;
  const player = players[room.sessionId];
  let content;

  useRoomListeners();

  if (error || isLoading || !player || !options) {
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
  } else if (currentPool === options.pools.length) {
    content = <Summary />;
  } else if (currentPool >= 0) {
    content = <PoolSelections />;
  } else {
    content = <PlayerReady />;
  }

  return content;
};
