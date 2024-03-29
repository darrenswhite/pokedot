import {Box, CircularProgress, Tooltip} from '@mui/material';
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {SpeciesContext} from './SpeciesProvider';

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
      <Box
        component={'span'}
        style={icon.css}
        sx={{
          '&:hover': {
            cursor: moreInfo && validName ? 'pointer' : '',
          },
        }}
        onClick={showMoreInfo}
      />
    );
  }, [moreInfo, showMoreInfo, name, validName]);

  const renderSpeciesSprite = useCallback(async () => {
    const {Sprites} = await import('@pkmn/img');
    const sprite = Sprites.getDexPokemon(name);

    return (
      <Box
        onClick={showMoreInfo}
        display="flex"
        alignItems="center"
        justifyContent="center"
        minWidth="150px"
        minHeight="150px"
        width="100%"
        height="100%"
        sx={{
          '&:hover': {
            cursor: moreInfo && validName ? 'pointer' : '',
          },
        }}
      >
        <img
          src={sprite.url}
          width={sprite.w}
          height={sprite.h}
          style={{
            imageRendering: sprite.pixelated ? 'pixelated' : undefined,
          }}
        />
      </Box>
    );
  }, [moreInfo, showMoreInfo, name, validName]);

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
