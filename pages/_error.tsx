import React from 'react';
import {NextPage, NextPageContext} from 'next';
import {Grid, makeStyles, Typography} from '@material-ui/core';
import {Sprites} from '@pkmn/img';

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

interface ErrorProps {
  statusCode: number;
}

const Error: NextPage<ErrorProps> = ({statusCode}: ErrorProps) => {
  const classes = useStyles();
  const avatar = Sprites.getAvatar('unknown');

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
          <Typography variant="body1" align="center">
            Something went wrong!
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

Error.getInitialProps = ({res, err}: NextPageContext): ErrorProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;

  return {statusCode};
};

export default Error;
