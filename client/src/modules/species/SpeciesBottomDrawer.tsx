import {Box, CircularProgress, Drawer, Grid} from '@mui/material';
import React, {useContext} from 'react';

import {useSpecie} from '../../hooks/useSpecies';

import {SpeciesHeader} from './SpeciesHeader';
import {SpeciesContext} from './SpeciesProvider';
import {SpeciesStats} from './SpeciesStats';

export const SpeciesBottomDrawer: React.FC = () => {
  const {open, setOpen, species} = useContext(SpeciesContext);
  const specie = useSpecie(species);

  return (
    <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
      <Box p={4}>
        <Grid container justifyContent="center" spacing={2}>
          {specie && (
            <>
              <Grid item>
                <SpeciesHeader specie={specie} />
              </Grid>

              <Grid item>
                <SpeciesStats specie={specie} />
              </Grid>
            </>
          )}

          {!specie && (
            <Grid item>
              <CircularProgress />
            </Grid>
          )}
        </Grid>
      </Box>
    </Drawer>
  );
};
