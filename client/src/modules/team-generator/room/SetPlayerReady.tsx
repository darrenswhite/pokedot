import {Button, Grid, Typography, makeStyles} from '@material-ui/core';
import React, {useContext} from 'react';

import {TeamGeneratorContext} from '../TeamGeneratorProvider';

import {RoomLayout} from './RoomLayout';

const useStyles = makeStyles(() => ({
  roomId: {
    fontFamily: 'Roboto Mono,monospace',
  },
}));

export const SetPlayerReady: React.FC = () => {
  const {room, state} = useContext(TeamGeneratorContext);
  const classes = useStyles();
  const ready = state.players[room.sessionId]?.ready;

  const setPlayerReady = () => {
    return room.send('SET_PLAYER_READY');
  };

  return (
    <RoomLayout
      header={
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Room code: <span className={classes.roomId}>{room.id}</span>
        </Typography>
      }
    >
      <Grid container justify="center">
        <Grid item xs={12} sm={8} md={5} lg={3} xl={2}>
          <Button
            onClick={setPlayerReady}
            variant="contained"
            color="primary"
            fullWidth
            disabled={ready}
          >
            Ready
          </Button>
        </Grid>
      </Grid>
    </RoomLayout>
  );
};
