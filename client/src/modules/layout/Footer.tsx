import {Grid, Paper, Typography, makeStyles} from '@material-ui/core';
import React, {FC} from 'react';

const useStyles = makeStyles(theme => ({
  footer: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 1 auto',
    flexWrap: 'wrap',
    position: 'relative',
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
  },
}));

export const Footer: FC = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Grid container>
        <Grid item xs={12}>
          <Paper elevation={0} className={classes.paper} square>
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
