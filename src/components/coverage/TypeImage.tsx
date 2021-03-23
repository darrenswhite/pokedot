import React from 'react';
import {Tooltip} from '@material-ui/core';
import {Icons} from '@pkmn/img';
import {TypeName} from '@pkmn/data';

export interface TypeImageProps {
  type: TypeName;
}

export const TypeImage: React.FC<TypeImageProps> = ({type}: TypeImageProps) => {
  return (
    <Tooltip title={type}>
      <img src={Icons.getType(type).url} />
    </Tooltip>
  );
};
