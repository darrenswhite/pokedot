import {CircularProgress, Grid, Typography} from '@material-ui/core';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';

import {useRoom} from '../../hooks/useRoom';

import {RoomInstance} from './RoomInstance';

export const RoomPage: React.FC = () => {
  const {query} = useRouter();
  const roomId = typeof query.roomId === 'string' ? query.roomId : '';
  const {room, state, error, joinRoom} = useRoom();
  let content;
  let player;

  useEffect(() => {
    joinRoom(roomId);
  }, [joinRoom, roomId]);

  if (error) {
    content = (
      <Grid
        container
        justify="center"
        alignContent="center"
        style={{height: '100%'}}
      >
        <Grid item>
          <Typography>{error}</Typography>
        </Grid>
      </Grid>
    );
  } else if (room && state && (player = state.players.get(room.sessionId))) {
    content = <RoomInstance room={room} state={state} player={player} />;
  } else {
    content = (
      <Grid
        container
        justify="center"
        alignContent="center"
        style={{height: '100%'}}
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return content;
};
