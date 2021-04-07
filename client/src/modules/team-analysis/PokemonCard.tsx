import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
} from '@material-ui/core';
import {PokemonSet, StatName} from '@pkmn/dex-types';
import {produce} from 'immer';
import React, {useContext, useEffect, useReducer} from 'react';

import {GenerationContext} from '../generation/GenerationProvider';
import {SpeciesImage, SpeciesImageType} from '../species-info/SpeciesImage';

import {PokemonAbilityInput} from './PokemonAbilityInput';
import {PokemonItemInput} from './PokemonItemInput';
import {PokemonLevelInput} from './PokemonLevelInput';
import {PokemonMoveInput} from './PokemonMoveInput';
import {PokemonStatInput} from './PokemonStatInput';

export enum PokemonActionType {
  SET_LEVEL,
  SET_MOVE,
  SET_EV,
  SET_IV,
  SET_ABILITY,
  SET_ITEM,
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

export interface SetAbilityItem {
  type: PokemonActionType.SET_ITEM;
  item: string;
}

export type PokemonAction =
  | SetLevelAction
  | SetMoveAction
  | SetEVAction
  | SetIVAction
  | SetAbilityAction
  | SetAbilityItem;

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
    default:
      return state;
  }
};

export interface PokemonCardProps {
  pokemon: PokemonSet;
  onChange: (pokemon: PokemonSet | null) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onChange,
}: PokemonCardProps) => {
  const {generation} = useContext(GenerationContext);
  const [state, dispatch] = useReducer(reducer, pokemon);

  useEffect(() => {
    onChange(state);
  }, [onChange, state]);

  return (
    <Card>
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

      <Grid container wrap="nowrap">
        <Grid item>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item>
                <PokemonAbilityInput pokemon={pokemon} dispatch={dispatch} />
              </Grid>

              <Grid item>
                <PokemonLevelInput pokemon={pokemon} dispatch={dispatch} />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item>
                <PokemonItemInput pokemon={pokemon} dispatch={dispatch} />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item>
                <PokemonMoveInput
                  pokemon={pokemon}
                  dispatch={dispatch}
                  index={0}
                />
              </Grid>

              <Grid item>
                <PokemonMoveInput
                  pokemon={pokemon}
                  dispatch={dispatch}
                  index={1}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item>
                <PokemonMoveInput
                  pokemon={pokemon}
                  dispatch={dispatch}
                  index={2}
                />
              </Grid>

              <Grid item>
                <PokemonMoveInput
                  pokemon={pokemon}
                  dispatch={dispatch}
                  index={3}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Grid>

        <Grid item>
          <CardContent>
            <Grid container spacing={1} direction="column">
              {Array.from(generation?.stats ?? []).map(stat => (
                <Grid key={stat} item>
                  <PokemonStatInput
                    pokemon={pokemon}
                    dispatch={dispatch}
                    stat={stat}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Grid>
      </Grid>

      <CardActions>
        <Button size="small" color="primary" onClick={() => onChange(null)}>
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};
