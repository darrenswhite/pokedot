import {Tooltip, makeStyles} from '@material-ui/core';
import {Icons} from '@pkmn/img';
import clsx from 'clsx';
import React, {useContext} from 'react';

import {SpeciesContext} from './SpeciesProvider';

const useStyle = makeStyles(() => ({
  icon: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export interface SpeciesImageProps {
  name: string;
  moreInfo?: boolean;
}

export const SpeciesImage: React.FC<SpeciesImageProps> = ({
  name,
  moreInfo,
}: SpeciesImageProps) => {
  const classes = useStyle();
  const {setOpen, setSpecies} = useContext(SpeciesContext);
  const tooltipTitle = moreInfo ? 'Click for more info' : '';

  const showMoreInfo = () => {
    if (moreInfo) {
      setSpecies(name);
      setOpen(true);
    }
  };

  return (
    <Tooltip title={tooltipTitle}>
      <span
        style={Icons.getPokemon(name).css}
        className={clsx({
          [classes.icon]: moreInfo,
        })}
        onClick={showMoreInfo}
      />
    </Tooltip>
  );
};
