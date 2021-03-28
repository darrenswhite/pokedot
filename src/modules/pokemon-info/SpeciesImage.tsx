import React, {useContext} from 'react';
import {makeStyles, Tooltip} from '@material-ui/core';
import clsx from 'clsx';
import {Icons} from '@pkmn/img';
import {SpeciesBottomDrawerContext} from './SpeciesBottomDrawer';

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
  const {setOpen, setSpecies} = useContext(SpeciesBottomDrawerContext);
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