import {Grid, Typography} from '@material-ui/core';
import React, {useContext} from 'react';

import {RoomContext} from './RoomProvider';
import {TeamGeneratorContainer} from './TeamGeneratorContainer';

export const Summary: React.FC = () => {
  const {state} = useContext(RoomContext);
  const players = Object.values(state?.players || {});

  return (
    <TeamGeneratorContainer
      header={
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Summary
        </Typography>
      }
    >
      <Grid container spacing={4}>
        <Grid item>
          <Typography align="center">{JSON.stringify(players)}</Typography>
        </Grid>
      </Grid>
    </TeamGeneratorContainer>
  );
};
