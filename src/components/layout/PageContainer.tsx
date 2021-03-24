import React from 'react';
import {Container, makeStyles} from '@material-ui/core';
import {Header} from './Header';
import {Footer} from './Footer';

type Props = {
  children: React.ReactNode;
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  wrapper: {
    flex: '1 1 auto',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    maxWidth: '100%',
    position: 'relative',
  },
  main: {
    display: 'flex',
    flex: '1 0 auto',
    maxWidth: '100%',
    paddingTop: theme.spacing(12),
  },
  container: {
    padding: theme.spacing(2),
  },
}));

export const PageContainer: React.FC<Props> = ({children}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Header />

        <main className={classes.main}>
          <Container maxWidth={false} className={classes.container}>
            <React.Fragment>{children}</React.Fragment>
          </Container>
        </main>

        <Footer />
      </div>
    </div>
  );
};
