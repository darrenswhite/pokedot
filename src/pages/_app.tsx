import React, {useEffect} from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import {NextRouter, useRouter} from 'next/router';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {Theme} from '../theme/Theme';
import {PageContainer} from '../modules/layout/PageContainer';
import {getCurrentRoute} from '../router/Routes';

const getTitle = (router: NextRouter): string => {
  const route = getCurrentRoute(router);
  let title = 'Pokédot | darrenswhite';

  if (route) {
    title = `${route.displayName} - ${title}`;
  } else if (router.pathname === '/404') {
    title = `Page Not Found - ${title}`;
  } else if (router.pathname === '/_error') {
    title = `Error - ${title}`;
  }

  return title;
};

const App: React.FC<AppProps> = (props: AppProps) => {
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
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="Pokédot is a collection of Pokémon related apps."
        />
      </Head>

      <ThemeProvider theme={Theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />

        <PageContainer>
          <Component {...pageProps} />
        </PageContainer>
      </ThemeProvider>
    </>
  );
};

export default App;
