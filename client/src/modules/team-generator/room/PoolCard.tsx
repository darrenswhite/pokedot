import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  CardMedia,
} from '@mui/material';
import React from 'react';

import {SpeciesImage, SpeciesImageType} from '../../species/SpeciesImage';
import {Pokemon} from '../TeamGeneratorState';

export interface PoolCardProps {
  pokemon: Pokemon;
  onSelect: () => void;
  selected: boolean;
}

export const PoolCard: React.FC<PoolCardProps> = ({
  pokemon,
  onSelect,
  selected,
}: PoolCardProps) => {
  return (
    <Card
      sx={{
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: theme =>
          selected ? theme.palette.primary.main : theme.palette.divider,
      }}
    >
      <CardHeader title={pokemon.baseSpecies} subheader={pokemon.form} />

      <CardActionArea>
        <CardMedia>
          <SpeciesImage
            name={pokemon.name}
            type={SpeciesImageType.SPRITE}
            moreInfo
          />
        </CardMedia>
      </CardActionArea>

      <CardActions>
        <Button size="small" color="primary" onClick={onSelect}>
          Choose
        </Button>
      </CardActions>
    </Card>
  );
};
