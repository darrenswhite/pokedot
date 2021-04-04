import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
  CardMedia,
  makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

import {SpeciesImage, SpeciesImageType} from '../pokemon-info/SpeciesImage';

import {Pokemon} from './TeamGeneratorState';

const useStyles = makeStyles(theme => ({
  unselected: {
    border: `1px solid ${theme.palette.divider}`,
  },
  selected: {
    border: `1px solid ${theme.palette.primary.main}`,
  },
}));

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
  const classes = useStyles();

  return (
    <Card
      className={clsx({
        [classes.unselected]: !selected,
        [classes.selected]: selected,
      })}
    >
      <CardHeader title={pokemon.name} />

      <CardActionArea>
        <CardMedia>
          <SpeciesImage
            name={pokemon.name}
            type={SpeciesImageType.SPRITE}
            moreInfo
          />
        </CardMedia>
      </CardActionArea>

      <CardActions style={{justifyContent: 'center'}}>
        <Button size="small" color="primary" onClick={onSelect}>
          Choose
        </Button>
      </CardActions>
    </Card>
  );
};
