import React, {createContext, useContext, useEffect, useState} from 'react';
import {Box, Drawer} from '@material-ui/core';
import {noop} from 'lodash/fp';
import {PokeInfo} from '../../pkmn/PokeInfo';
import {SpeciesInfo} from './SpeciesInfo';

export const SpeciesBottomDrawerContext = createContext({
  open: false,
  setOpen: noop,
  species: '',
  setSpecies: noop,
});

export const SpeciesBottomDrawer: React.FC = () => {
  const {open, setOpen, species} = useContext(SpeciesBottomDrawerContext);
  const [info, setInfo] = useState<PokeInfo | undefined>();
  let content;

  if (info) {
    content = <SpeciesInfo info={info} />;
  }

  useEffect(() => {
    if (species.length > 0) {
      PokeInfo.forSpecies(species).then(setInfo);
    }
  }, [species]);

  return (
    <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
      <Box p={4}>{content}</Box>
    </Drawer>
  );
};
