import {PokemonSet} from '@pkmn/data';
import {noop} from 'lodash/fp';
import React, {createContext, useState} from 'react';

export interface TeamContextProps {
  team: PokemonSet[];
  setTeam: (team: PokemonSet[]) => void;
}

export const TeamContext = createContext<TeamContextProps>({
  team: [],
  setTeam: noop,
});

export interface TeamProviderProps {
  children: NonNullable<React.ReactNode>;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({
  children,
}: TeamProviderProps) => {
  const [team, setTeam] = useState<PokemonSet[]>([]);

  return (
    <TeamContext.Provider value={{team, setTeam}}>
      {children}
    </TeamContext.Provider>
  );
};
