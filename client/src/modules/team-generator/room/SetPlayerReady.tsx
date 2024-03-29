import {Box, Button, Grid, Typography} from '@mui/material';
import React, {useContext} from 'react';

import {TeamGeneratorContext} from '../TeamGeneratorProvider';

import {RoomLayout} from './RoomLayout';

export const SetPlayerReady: React.FC = () => {
  const {room, state} = useContext(TeamGeneratorContext);
  const ready = state.players[room.sessionId]?.ready;

  const setPlayerReady = () => {
    return room.send('SET_PLAYER_READY');
  };

  return (
    <RoomLayout
      header={
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Room code:{' '}
          <Box component={'span'} fontFamily={'Roboto Mono,monospace'}>
            {room.id}
          </Box>
        </Typography>
      }
    >
      <Grid container justifyContent="center">
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
