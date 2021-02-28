import React from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  makeStyles,
  Paper,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import {Theme} from '../src/Theme';
import {Header} from '../src/Header';
import {getCurrentRoute} from '../src/Routes';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    maxWidth: '100%',
    position: 'relative',
  },
  content: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    marginTop: theme.spacing(6),
  },
  main: {
    flex: '1 1 auto',
    maxWidth: '100%',
    position: 'relative',
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 1 auto!important',
    flexWrap: 'wrap',
    position: 'relative',
  },
  footerPaper: {
    padding: theme.spacing(1),
    textAlign: 'center',
  },
}));

export default function App(props: AppProps): React.ReactNode {
  const {Component, pageProps} = props;
  const classes = useStyles();
  const router = useRouter();
  const currentRoute = getCurrentRoute(router);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Pokédot</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <ThemeProvider theme={Theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />

        <div className={classes.root}>
          <Header />

          <div className={classes.content}>
            <main className={classes.main}>
              <Container maxWidth="sm">
                <Box my={4}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {currentRoute?.displayName}
                  </Typography>
                </Box>
                <Component {...pageProps} />
              </Container>
            </main>

            <footer className={classes.footer}>
              <Grid container>
                <Grid item xs={12}>
                  <Paper elevation={0} className={classes.footerPaper}>
                    <Typography>
                      {new Date().getFullYear()} — <strong>Pokédot</strong>{' '}
                      created by Darren S. White
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </footer>
          </div>
        </div>
      </ThemeProvider>
    </React.Fragment>
  );
}
