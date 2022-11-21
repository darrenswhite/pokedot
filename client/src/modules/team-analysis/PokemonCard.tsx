import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  IconButton,
  colors,
  makeStyles,
} from '@material-ui/core';
import {DeleteOutline, ExpandMore} from '@material-ui/icons';
import {PokemonSet, StatID, StatsTable} from '@pkmn/data';
import clsx from 'clsx';
import React, {useState} from 'react';

import {SpeciesImage, SpeciesImageType} from '../species/SpeciesImage';

import {PokemonAbilityInput} from './PokemonAbilityInput';
import {PokemonItemInput} from './PokemonItemInput';
import {PokemonLevelInput} from './PokemonLevelInput';
import {PokemonMoveInput} from './PokemonMoveInput';
import {PokemonNatureInput} from './PokemonNatureInput';
import {PokemonStatInput} from './PokemonStatInput';

const STAT_COLORS: StatsTable<Record<number, string>> = {
  hp: colors.red,
  atk: colors.amber,
  def: colors.yellow,
  spa: colors.blue,
  spd: colors.green,
  spe: colors.purple,
};

const useStyles = makeStyles(theme => ({
  root: {
    width: 332,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

export interface PokemonCardProps {
  pokemon: PokemonSet;
  onChange: (recipe: (pokemon: PokemonSet) => void) => void;
  onRemove: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onChange,
  onRemove,
}: PokemonCardProps) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => setExpanded(!expanded);

  return (
    <Card className={classes.root} raised>
      <CardHeader
        title={pokemon.name.length > 0 ? pokemon.name : pokemon.species}
        avatar={
          <SpeciesImage
            name={pokemon.species}
            type={SpeciesImageType.ICON}
            moreInfo
          />
        }
        action={
          <CardActions disableSpacing>
            <IconButton onClick={onRemove} aria-label="remove">
              <DeleteOutline />
            </IconButton>

            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMore />
            </IconButton>
          </CardActions>
        }
      />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />

        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs>
                  <PokemonAbilityInput pokemon={pokemon} onChange={onChange} />
                </Grid>

                <Grid item xs>
                  <PokemonLevelInput pokemon={pokemon} onChange={onChange} />
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs>
                  <PokemonItemInput pokemon={pokemon} onChange={onChange} />
                </Grid>

                <Grid item xs>
                  <PokemonNatureInput pokemon={pokemon} onChange={onChange} />
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs>
                  <PokemonMoveInput
                    pokemon={pokemon}
                    onChange={onChange}
                    index={0}
                  />
                </Grid>

                <Grid item xs>
                  <PokemonMoveInput
                    pokemon={pokemon}
                    onChange={onChange}
                    index={1}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs>
                  <PokemonMoveInput
                    pokemon={pokemon}
                    onChange={onChange}
                    index={2}
                  />
                </Grid>

                <Grid item xs>
                  <PokemonMoveInput
                    pokemon={pokemon}
                    onChange={onChange}
                    index={3}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs>
              <Grid container wrap="nowrap" justifyContent="center">
                {Object.entries(STAT_COLORS).map(([stat, color]) => (
                  <Grid key={stat} item>
                    <PokemonStatInput
                      pokemon={pokemon}
                      onChange={onChange}
                      stat={stat as StatID}
                      color={color}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};
