import {Container, makeStyles} from '@material-ui/core';
import dynamic from 'next/dynamic';
import React from 'react';

import {GenerationProviderProps} from '../generation/GenerationProvider';
import {SpeciesProviderProps} from '../species-info/SpeciesProvider';
import {TeamProviderProps} from '../team-analysis/TeamProvider';
import {RoomProviderProps} from '../team-generator/RoomProvider';

import {Footer} from './Footer';
import {Header} from './Header';

const SpeciesBottomDrawer = dynamic<unknown>(() =>
  import('../species-info/SpeciesBottomDrawer').then(m => m.SpeciesBottomDrawer)
);

const GenerationProvider = dynamic<GenerationProviderProps>(() =>
  import('../generation/GenerationProvider').then(m => m.GenerationProvider)
);

const SpeciesProvider = dynamic<SpeciesProviderProps>(() =>
  import('../species-info/SpeciesProvider').then(m => m.SpeciesProvider)
);

const TeamProvider = dynamic<TeamProviderProps>(() =>
  import('../team-analysis/TeamProvider').then(m => m.TeamProvider)
);

const RoomProvider = dynamic<RoomProviderProps>(() =>
  import('../team-generator/RoomProvider').then(m => m.RoomProvider)
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
    <main className={classes.root}>
      <div className={classes.wrapper}>
        <Header />

        <RoomProvider>
          <GenerationProvider>
            <SpeciesProvider>
              <TeamProvider>
                <div className={classes.main}>
                  <Container maxWidth={false} className={classes.container}>
                    {children}
                  </Container>
                </div>

                <SpeciesBottomDrawer />
              </TeamProvider>
            </SpeciesProvider>
          </GenerationProvider>
        </RoomProvider>

        <Footer />
      </div>
    </main>
  );
};
