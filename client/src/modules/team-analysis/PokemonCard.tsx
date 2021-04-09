import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  colors,
  makeStyles,
} from '@material-ui/core';
import {PokemonSet, StatName, StatsTable} from '@pkmn/data';
import {produce} from 'immer';
import React, {useEffect, useReducer} from 'react';

import {SpeciesImage, SpeciesImageType} from '../species-info/SpeciesImage';

import {PokemonAbilityInput} from './PokemonAbilityInput';
import {PokemonItemInput} from './PokemonItemInput';
import {PokemonLevelInput} from './PokemonLevelInput';
import {PokemonMoveInput} from './PokemonMoveInput';
import {PokemonNatureInput} from './PokemonNatureInput';
import {PokemonStatInput} from './PokemonStatInput';

export enum PokemonActionType {
  SET_LEVEL,
  SET_MOVE,
  SET_EV,
  SET_IV,
  SET_ABILITY,
  SET_ITEM,
  SET_NATURE,
}

export interface SetLevelAction {
  type: PokemonActionType.SET_LEVEL;
  level: number;
}

export interface SetMoveAction {
  type: PokemonActionType.SET_MOVE;
  index: number;
  move: string;
}

export interface SetEVAction {
  type: PokemonActionType.SET_EV;
  stat: StatName;
  value: number;
}

export interface SetIVAction {
  type: PokemonActionType.SET_IV;
  stat: StatName;
  value: number;
}

export interface SetAbilityAction {
  type: PokemonActionType.SET_ABILITY;
  ability: string;
}

export interface SetItemAction {
  type: PokemonActionType.SET_ITEM;
  item: string;
}

export interface SetNatureAction {
  type: PokemonActionType.SET_NATURE;
  nature: string;
}

export type PokemonAction =
  | SetLevelAction
  | SetMoveAction
  | SetEVAction
  | SetIVAction
  | SetAbilityAction
  | SetItemAction
  | SetNatureAction;

const reducer = (state: PokemonSet, action: PokemonAction) => {
  switch (action.type) {
    case PokemonActionType.SET_LEVEL:
      return produce(state, draft => {
        draft.level = action.level;
      });
    case PokemonActionType.SET_MOVE:
      return produce(state, draft => {
        draft.moves[action.index] = action.move;
      });
    case PokemonActionType.SET_EV:
      return produce(state, draft => {
        draft.evs[action.stat] = action.value;
      });
    case PokemonActionType.SET_IV:
      return produce(state, draft => {
        draft.ivs[action.stat] = action.value;
      });
    case PokemonActionType.SET_ABILITY:
      return produce(state, draft => {
        draft.ability = action.ability;
      });
    case PokemonActionType.SET_ITEM:
      return produce(state, draft => {
        draft.item = action.item;
      });
    case PokemonActionType.SET_NATURE:
      return produce(state, draft => {
        draft.nature = action.nature;
      });
    default:
      return state;
  }
};

const STAT_COLORS: StatsTable<Record<number, string>> = {
  hp: colors.red,
  atk: colors.amber,
  def: colors.yellow,
  spa: colors.blue,
  spd: colors.green,
  spe: colors.purple,
};

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 400,
  },
}));

export interface PokemonCardProps {
  pokemon: PokemonSet;
  onChange: (pokemon: PokemonSet | null) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onChange,
}: PokemonCardProps) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, pokemon);

  useEffect(() => {
    onChange(state);
  }, [onChange, state]);

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
      />

      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs>
                <PokemonAbilityInput pokemon={pokemon} dispatch={dispatch} />
              </Grid>

              <Grid item xs>
                <PokemonLevelInput pokemon={pokemon} dispatch={dispatch} />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs>
                <PokemonItemInput pokemon={pokemon} dispatch={dispatch} />
              </Grid>

              <Grid item xs>
                <PokemonNatureInput pokemon={pokemon} dispatch={dispatch} />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs>
                <PokemonMoveInput
                  pokemon={pokemon}
                  dispatch={dispatch}
                  index={0}
                />
              </Grid>

              <Grid item xs>
                <PokemonMoveInput
                  pokemon={pokemon}
                  dispatch={dispatch}
                  index={1}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs>
                <PokemonMoveInput
                  pokemon={pokemon}
                  dispatch={dispatch}
                  index={2}
                />
              </Grid>

              <Grid item xs>
                <PokemonMoveInput
                  pokemon={pokemon}
                  dispatch={dispatch}
                  index={3}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs>
            <Grid container wrap="nowrap">
              {Object.entries(STAT_COLORS).map(([stat, color]) => (
                <Grid key={stat} item xs>
                  <PokemonStatInput
                    pokemon={pokemon}
                    dispatch={dispatch}
                    stat={stat as StatName}
                    color={color}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>

      <CardActions>
        <Button size="small" color="primary" onClick={() => onChange(null)}>
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};
