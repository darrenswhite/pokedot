import {Tooltip, makeStyles} from '@material-ui/core';
import {Icons, Sprites} from '@pkmn/img';
import clsx from 'clsx';
import React, {useContext} from 'react';

import {SpeciesContext} from './SpeciesProvider';

const useStyle = makeStyles(() => ({
  image: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  pixelated: {
    imageRendering: 'pixelated',
  },
}));

export enum SpeciesImageType {
  ICON,
  SPRITE,
}

export interface SpeciesImageProps {
  name: string;
  type: SpeciesImageType;
  moreInfo?: boolean;
  showTooltip?: boolean;
}

export const SpeciesImage: React.FC<SpeciesImageProps> = ({
  name,
  type,
  moreInfo,
  showTooltip,
}: SpeciesImageProps) => {
  const classes = useStyle();
  const {setOpen, setSpecies} = useContext(SpeciesContext);
  let image;

  const showMoreInfo = () => {
    if (moreInfo) {
      setSpecies(name);
      setOpen(true);
    }
  };

  const renderSpeciesIcon = () => {
    const icon = Icons.getPokemon(name);

    return (
      <span
        style={icon.css}
        className={clsx({
          [classes.image]: moreInfo,
        })}
      />
    );
  };

  const renderSpeciesSprite = () => {
    const sprite = Sprites.getDexPokemon(name);

    return (
      <img
        src={sprite.url}
        width={sprite.w}
        height={sprite.h}
        className={clsx({
          [classes.image]: moreInfo,
          [classes.pixelated]: sprite.pixelated,
        })}
      />
    );
  };

  if (type === SpeciesImageType.ICON) {
    image = renderSpeciesIcon();
  } else if (type === SpeciesImageType.SPRITE) {
    image = renderSpeciesSprite();
  } else {
    image = renderSpeciesIcon();
  }

  return (
    <Tooltip title={showTooltip ? name : ''}>
      <span
        className={clsx({
          [classes.image]: moreInfo,
        })}
        onClick={showMoreInfo}
      >
        {image}
      </span>
    </Tooltip>
  );
};
