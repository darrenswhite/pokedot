import {Container, makeStyles} from '@material-ui/core';
import dynamic from 'next/dynamic';
import React from 'react';

import {SpeciesProviderProps} from '../pokemon-info/SpeciesProvider';
import {RoomProvider} from '../team-generator/RoomProvider';

import {Footer} from './Footer';
import {Header} from './Header';

const SpeciesBottomDrawer = dynamic<unknown>(() =>
  import('../pokemon-info/SpeciesBottomDrawer').then(m => m.SpeciesBottomDrawer)
);

const SpeciesProvider = dynamic<SpeciesProviderProps>(() =>
  import('../pokemon-info/SpeciesProvider').then(m => m.SpeciesProvider)
);

type PageContainerProps = {
  children: NonNullable<React.ReactNode>;
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

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
}: PageContainerProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Header />

        <RoomProvider>
          <SpeciesProvider>
            <main className={classes.main}>
              <Container maxWidth={false} className={classes.container}>
                {children}
              </Container>
            </main>

            <SpeciesBottomDrawer />
          </SpeciesProvider>
        </RoomProvider>

        <Footer />
      </div>
    </div>
  );
};
