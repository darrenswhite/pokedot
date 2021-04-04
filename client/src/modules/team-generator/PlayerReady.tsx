import {Button, Grid, Typography} from '@material-ui/core';
import React, {useContext} from 'react';

import {RoomContext} from './RoomProvider';
import {TeamGeneratorContainer} from './TeamGeneratorContainer';

export const PlayerReady: React.FC = () => {
  const {room} = useContext(RoomContext);

  const setPlayerReady = () => room.send('SET_PLAYER_READY');

  return (
    <TeamGeneratorContainer
      header={
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Room code: {room.id}
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
          >
            Ready
          </Button>
        </Grid>
      </Grid>
    </TeamGeneratorContainer>
  );
};
