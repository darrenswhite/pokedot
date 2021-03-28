import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {Container, makeStyles} from '@material-ui/core';
import {Header} from './Header';
import {Footer} from './Footer';
import {SpeciesBottomDrawerContext} from '../pokemon-info/SpeciesBottomDrawer';

const SpeciesBottomDrawer = dynamic<unknown>(() =>
  import('../pokemon-info/SpeciesBottomDrawer').then(m => m.SpeciesBottomDrawer)
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
  const [open, setOpen] = useState(false);
  const [species, setSpecies] = useState('');
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Header />

        <SpeciesBottomDrawerContext.Provider
          value={{open, setOpen, species, setSpecies}}
        >
          <main className={classes.main}>
            <Container maxWidth={false} className={classes.container}>
              {children}
            </Container>
          </main>

          <SpeciesBottomDrawer />
        </SpeciesBottomDrawerContext.Provider>

        <Footer />
      </div>
    </div>
  );
};
