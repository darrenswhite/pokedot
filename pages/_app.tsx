import React, {useEffect} from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {NextRouter, useRouter} from 'next/router';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {Theme} from '../src/theme/Theme';
import {PageContainer} from '../src/components/layout/PageContainer';
import {getCurrentRoute} from '../src/router/Routes';

const getTitle = (router: NextRouter): string => {
  const route = getCurrentRoute(router);
  let title = 'Pokédot | darrenswhite';

  if (route) {
    title = `${route.displayName} - ${title}`;
  }

  return title;
};

export default function App(props: AppProps): React.ReactNode {
  const {Component, pageProps} = props;
  const router = useRouter();
  const title = getTitle(router);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
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
