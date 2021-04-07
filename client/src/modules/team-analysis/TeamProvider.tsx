import {PokemonSet} from '@pkmn/dex-types';
import {produce} from 'immer';
import {noop} from 'lodash/fp';
import React, {createContext, useReducer} from 'react';

export interface TeamContextProps {
  state: TeamState;
  dispatch: React.Dispatch<TeamAction>;
}

export interface TeamState {
  team: PokemonSet[];
}

export enum TeamActionType {
  SET_TEAM,
  ADD_POKEMON,
  REMOVE_POKEMON,
  UPDATE_POKEMON,
}

export const initialState = (): TeamState => ({
  team: [],
});

export const TeamContext = createContext<TeamContextProps>({
  state: initialState(),
  dispatch: noop,
});

export interface SetTeamAction {
  type: TeamActionType.SET_TEAM;
  pokemon: PokemonSet[];
}

export interface AddPokemonAction {
  type: TeamActionType.ADD_POKEMON;
  pokemon: PokemonSet;
}

export interface RemovePokemonAction {
  type: TeamActionType.REMOVE_POKEMON;
  index: number;
}

export interface UpdatePokemonAction {
  type: TeamActionType.UPDATE_POKEMON;
  index: number;
  pokemon: PokemonSet;
}

export type TeamAction =
  | SetTeamAction
  | AddPokemonAction
  | RemovePokemonAction
  | UpdatePokemonAction;

const reducer = (state: TeamState, action: TeamAction) => {
  switch (action.type) {
    case TeamActionType.SET_TEAM:
      return {
        team: action.pokemon,
      };
    case TeamActionType.ADD_POKEMON:
      return produce(state, draft => {
        draft.team.push(action.pokemon);
      });
    case TeamActionType.REMOVE_POKEMON:
      return produce(state, draft => {
        draft.team.splice(action.index, 1);
      });
    case TeamActionType.UPDATE_POKEMON:
      return produce(state, draft => {
        draft.team[action.index] = action.pokemon;
      });
    default:
      return state;
  }
};

export interface TeamProviderProps {
  children: NonNullable<React.ReactNode>;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({
  children,
}: TeamProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState());

  return (
    <TeamContext.Provider value={{state, dispatch}}>
      {children}
    </TeamContext.Provider>
  );
};
