import React, {useEffect, useState} from 'react';
import {Grid, makeStyles, Typography} from '@material-ui/core';
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

const RandomMessage: React.FC<{messages: string[]}> = ({
  messages,
}: {
  messages: string[];
}) => {
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

export interface ErrorProps {
  statusCode: number;
  avatarName: string;
  messages: string[];
}

export const Error: React.FC<ErrorProps> = ({
  statusCode,
  avatarName,
  messages,
}: ErrorProps) => {
  const classes = useStyles();
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    import('@pkmn/img').then(({Sprites}) => {
      setAvatar(Sprites.getAvatar(avatarName));
    });
  }, []);

  return (
    <div className={classes.container}>
      <Grid container justify="center">
        <Grid item xs={12}>
          <Typography variant="h3" component="h1" align="center">
            {statusCode}
          </Typography>
        </Grid>

        <Grid item className={classes.avator}>
          <img src={avatar} />
        </Grid>

        <Grid item xs={12}>
          <RandomMessage messages={messages} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Error;
