import {CircularProgress, Tooltip, makeStyles} from '@material-ui/core';
import clsx from 'clsx';
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

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
  spriteContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '150px',
    minHeight: '150px',
    width: '100%',
    height: '100%',
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
  const validName = name && name.length > 0;
  const [image, setImage] = useState<ReactElement>(<CircularProgress />);

  const showMoreInfo = useCallback(() => {
    if (moreInfo && validName) {
      setSpecies(name);
      setOpen(true);
    }
  }, [moreInfo, validName, name, setSpecies, setOpen]);

  const renderSpeciesIcon = useCallback(async () => {
    const {Icons} = await import('@pkmn/img');
    const icon = Icons.getPokemon(name);

    return (
      <span
        style={icon.css}
        className={clsx({
          [classes.image]: moreInfo && validName,
        })}
        onClick={showMoreInfo}
      />
    );
  }, [classes.image, moreInfo, showMoreInfo, name, validName]);

  const renderSpeciesSprite = useCallback(async () => {
    const {Sprites} = await import('@pkmn/img');
    const sprite = Sprites.getDexPokemon(name);

    return (
      <div
        className={clsx({
          [classes.image]: moreInfo && validName,
          [classes.spriteContainer]: true,
        })}
        onClick={showMoreInfo}
      >
        <img
          src={sprite.url}
          width={sprite.w}
          height={sprite.h}
          className={clsx({
            [classes.pixelated]: sprite.pixelated,
          })}
        />
      </div>
    );
  }, [
    classes.image,
    classes.spriteContainer,
    classes.pixelated,
    moreInfo,
    showMoreInfo,
    name,
    validName,
  ]);

  useEffect(() => {
    if (type === SpeciesImageType.ICON) {
      renderSpeciesIcon()
        .then(setImage)
        .catch(err => {
          console.log(`Failed to render species icon ${name}.`, err);
        });
    } else if (type === SpeciesImageType.SPRITE) {
      renderSpeciesSprite()
        .then(setImage)
        .catch(err => {
          console.log(`Failed to render species icon ${name}.`, err);
        });
    }
  }, [name, type, renderSpeciesIcon, renderSpeciesSprite]);

  return (
    <Tooltip title={showTooltip && validName ? name : ''}>{image}</Tooltip>
  );
};
