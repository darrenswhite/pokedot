import {Box, Grid, Typography, makeStyles} from '@material-ui/core';
import {sample} from 'lodash/fp';
import React, {useEffect, useState} from 'react';

const useStyles = makeStyles(theme => ({
  avatar: {
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
  }, [messages]);

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
    import('@pkmn/img')
      .then(({Sprites}) => {
        setAvatar(Sprites.getAvatar(avatarName));
      })
      .catch(e => {
        console.error('Failed to import @pkmn/img.', e);
      });
  }, [avatarName]);

  return (
    <Box
      display="flex"
      height="100%"
      alignContent="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Grid container justify="center">
        <Grid item xs={12}>
          <Typography variant="h3" component="h1" align="center">
            {statusCode}
          </Typography>
        </Grid>

        <Grid item className={classes.avatar}>
          <img src={avatar} />
        </Grid>

        <Grid item xs={12}>
          <RandomMessage messages={messages} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Error;
