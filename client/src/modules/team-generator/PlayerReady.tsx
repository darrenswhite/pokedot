import {Button, Grid, Typography, makeStyles} from '@material-ui/core';
import React, {useContext} from 'react';

import {RoomContext} from './RoomProvider';
import {TeamGeneratorContainer} from './TeamGeneratorContainer';

const useStyles = makeStyles(() => ({
  roomId: {
    fontFamily: 'Roboto Mono,monospace',
  },
}));

export const PlayerReady: React.FC = () => {
  const {room, state} = useContext(RoomContext);
  const classes = useStyles();
  const ready = state.players[room.sessionId]?.ready;

  const setPlayerReady = () => room.send('SET_PLAYER_READY');

  return (
    <TeamGeneratorContainer
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
    </TeamGeneratorContainer>
  );
};
