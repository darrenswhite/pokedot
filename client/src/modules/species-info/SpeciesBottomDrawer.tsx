import {Box, CircularProgress, Drawer, Grid} from '@material-ui/core';
import React, {useContext} from 'react';

import {useSpecie} from '../../hooks/useSpecies';

import {SpecieHeader} from './SpecieHeader';
import {SpeciesContext} from './SpeciesProvider';
import {SpecieStats} from './SpecieStats';

export const SpeciesBottomDrawer: React.FC = () => {
  const {open, setOpen, species} = useContext(SpeciesContext);
  const specie = useSpecie(species);
  let content;

  if (specie) {
    content = (
      <>
        <Grid item>
          <SpecieHeader specie={specie} />
        </Grid>
        <Grid item>
          <SpecieStats specie={specie} />
        </Grid>
      </>
    );
  } else {
    content = (
      <Grid item>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
      <Box p={4}>
        <Grid container justify="center" spacing={2}>
          {content}
        </Grid>
      </Box>
    </Drawer>
  );
};
