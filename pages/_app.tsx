import React from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {Theme} from '../src/Theme';
import {PageContainer} from '../src/PageContainer';

export default function App(props: AppProps): React.ReactNode {
  const {Component, pageProps} = props;

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

        <PageContainer>
          <Component {...pageProps} />
        </PageContainer>
      </ThemeProvider>
    </React.Fragment>
  );
}
