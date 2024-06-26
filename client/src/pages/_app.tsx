import {CssBaseline, ThemeProvider} from '@mui/material';
import {enablePatches} from 'immer';
import {AppProps} from 'next/app';
import Head from 'next/head';
import {NextRouter, useRouter} from 'next/router';
import React, {useEffect} from 'react';

import {PageContainer} from '../modules/layout/PageContainer';
import {getCurrentRoute} from '../router/Routes';
import {Theme} from '../theme/Theme';

enablePatches();

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
  const router = useRouter();
  const title = getTitle(router);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').catch(err => {
        console.error('Failed to register service worker.', err);
      });
    }
  });

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta name="author" content="Darren S. White" />
        <meta
          name="description"
          content="Pokédot is a collection of Pokémon related apps."
        />
      </Head>

      <ThemeProvider theme={Theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />

        <PageContainer>
          <props.Component {...props.pageProps} />
        </PageContainer>
      </ThemeProvider>
    </>
  );
};

export default App;
