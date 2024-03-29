import {Grid, Paper, Typography} from '@mui/material';
import React, {FC} from 'react';

export const Footer: FC = () => {
  return (
    <footer
      style={{
        alignItems: 'center',
        display: 'flex',
        flex: '0 1 auto',
        flexWrap: 'wrap',
        position: 'relative',
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Paper elevation={0} square sx={{padding: 1, textAlign: 'center'}}>
            <Typography>
              {new Date().getFullYear()} — <strong>Pokédot</strong> created by
              Darren S. White
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </footer>
  );
};
