import React, {FC} from 'react';
import {useRouter} from 'next/router';
import {Box, Container, makeStyles, Typography} from '@material-ui/core';
import {Header} from '../src/Header';
import {Footer} from '../src/Footer';
import {getCurrentRoute} from '../src/Routes';

type Props = {
  children: React.ReactNode;
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  wrapper: {
    flex: '1 1 auto',
    display: 'flex',
    minHeight: '100vh',
    maxWidth: '100%',
    position: 'relative',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  main: {
    display: 'flex',
    flexGrow: 1,
    maxWidth: '100%',
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export const PageContainer: FC<Props> = ({children}: Props) => {
  const classes = useStyles();
  const router = useRouter();
  const currentRoute = getCurrentRoute(router);

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Header />

        <div className={classes.content}>
          <main className={classes.main}>
            <div className={classes.appBarSpacer} />

            <Container maxWidth="lg" className={classes.container}>
              <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {currentRoute?.displayName}
                </Typography>
              </Box>

              {children}
            </Container>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};
