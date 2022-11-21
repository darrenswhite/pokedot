import {CircularProgress, Grid, Typography} from '@material-ui/core';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import React from 'react';

import {useJoinRoom, useRoomListeners} from '../../../hooks/useRoom';
import {TeamGeneratorContext} from '../TeamGeneratorProvider';

const SetPlayerName = dynamic(() =>
  import('./SetPlayerName').then(m => m.SetPlayerName)
);

const SetPlayerReady = dynamic(() =>
  import('./SetPlayerReady').then(m => m.SetPlayerReady)
);

const Pool = dynamic(() => import('./Pool').then(m => m.Pool));

const Summary = dynamic(() => import('./Summary').then(m => m.Summary));

export const RoomPage: React.FC = () => {
  const {query} = useRouter();
  const roomId = typeof query.roomId === 'string' ? query.roomId : '';
  const {isLoading, error, room, state} = useJoinRoom(
    TeamGeneratorContext,
    roomId
  );
  const {currentPool, options, players} = state;
  const player = players[room.sessionId];
  let content;

  useRoomListeners(TeamGeneratorContext);

  if (error || isLoading || !player || !options) {
    content = (
      <Grid
        container
        justifyContent="center"
        alignContent="center"
        style={{height: '100%'}}
      >
        <Grid item>
          {error ? <Typography>{error}</Typography> : <CircularProgress />}
        </Grid>
      </Grid>
    );
  } else if (player.name === 'Anonymous') {
    content = <SetPlayerName />;
  } else if (currentPool === options.pools.length) {
    content = <Summary />;
  } else if (currentPool >= 0) {
    content = <Pool />;
  } else {
    content = <SetPlayerReady />;
  }

  return content;
};
