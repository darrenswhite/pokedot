import React from 'react';
import {Tooltip} from '@material-ui/core';
import {Icons} from '@pkmn/img';

export interface SpeciesImageProps {
  name: string;
}

export const SpeciesImage: React.FC<SpeciesImageProps> = ({
  name,
}: SpeciesImageProps) => {
  return (
    <Tooltip title={name}>
      <span style={Icons.getPokemon(name).css} />
    </Tooltip>
  );
};
