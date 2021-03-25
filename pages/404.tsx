import React, {useEffect, useState} from 'react';
import {Grid, makeStyles, Typography} from '@material-ui/core';
import {Sprites} from '@pkmn/img';
import {sample} from 'lodash/fp';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    height: `calc(100vh - ${theme.spacing(22)}px)`,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avator: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(12),
  },
}));

const messages = [
  "What do you want? You can't pass through here right now! We're on guard duty! It's very important!",
  "What're you doing here, twerp? Shoo! Go pester someone else!",
  'Hey, do you want to join Team Rocket?',
];

const RandomMessage: React.FC = () => {
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    setMessage(sample(messages));
  }, []);

  return (
    <Typography variant="body1" align="center">
      {message}
    </Typography>
  );
};

const Error404: React.FC = () => {
  const classes = useStyles();
  const avatar = Sprites.getAvatar('teamrocket');

  return (
    <div className={classes.container}>
      <Grid container justify="center">
        <Grid item xs={12}>
          <Typography variant="h3" component="h1" align="center">
            404
          </Typography>
        </Grid>

        <Grid item className={classes.avator}>
          <img src={avatar} />
        </Grid>

        <Grid item xs={12}>
          <RandomMessage />
        </Grid>
      </Grid>
    </div>
  );
};

export default Error404;
