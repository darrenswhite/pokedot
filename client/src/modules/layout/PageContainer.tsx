import {Container, makeStyles} from '@material-ui/core';
import dynamic from 'next/dynamic';
import React from 'react';

import {GenerationProviderProps} from '../generation/GenerationProvider';
import {SpeciesProviderProps} from '../species/SpeciesProvider';
import {TeamProviderProps} from '../team-analysis/TeamProvider';
import {TeamGeneratorProviderProps} from '../team-generator/TeamGeneratorProvider';

import {Footer} from './Footer';
import {Header} from './Header';

const SpeciesBottomDrawer = dynamic<unknown>(
  () =>
    import('../species/SpeciesBottomDrawer').then(m => m.SpeciesBottomDrawer),
  {
    ssr: false,
  }
);

const GenerationProvider = dynamic<GenerationProviderProps>(
  () =>
    import('../generation/GenerationProvider').then(m => m.GenerationProvider),
  {
    ssr: false,
  }
);

const SpeciesProvider = dynamic<SpeciesProviderProps>(
  () => import('../species/SpeciesProvider').then(m => m.SpeciesProvider),
  {
    ssr: false,
  }
);

const TeamProvider = dynamic<TeamProviderProps>(
  () => import('../team-analysis/TeamProvider').then(m => m.TeamProvider),
  {
    ssr: false,
  }
);

const TeamGeneratorProvider = dynamic<TeamGeneratorProviderProps>(
  () =>
    import('../team-generator/TeamGeneratorProvider').then(
      m => m.TeamGeneratorProvider
    ),
  {
    ssr: false,
  }
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

        <TeamGeneratorProvider>
          <GenerationProvider>
            <SpeciesProvider>
              <TeamProvider>
                <main role="main" className={classes.main}>
                  <Container maxWidth={false} className={classes.container}>
                    {children}
                  </Container>
                </main>

                <SpeciesBottomDrawer />
              </TeamProvider>
            </SpeciesProvider>
          </GenerationProvider>
        </TeamGeneratorProvider>

        <Footer />
      </div>
    </div>
  );
};
