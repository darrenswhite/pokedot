import React from 'react';
import {Grid, Typography} from '@material-ui/core';

const Home: React.FC = () => {
  return (
    <Grid container justify="center">
      <Grid item xs={12}>
        <Typography variant="body1" align="center">
          Pokédot is a collection of Pokémon related apps. Use the tabs above to
          navigate between each app.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Home;
