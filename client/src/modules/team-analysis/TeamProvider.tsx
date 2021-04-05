import {noop} from 'lodash/fp';
import React, {createContext, useState} from 'react';

import {PartialPokemonSet} from '../../pkmn/PokeInfo';

export interface TeamContextProps {
  team: PartialPokemonSet[];
  setTeam: (team: PartialPokemonSet[]) => void;
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
  const [team, setTeam] = useState<PartialPokemonSet[]>([]);

  return (
    <TeamContext.Provider value={{team, setTeam}}>
      {children}
    </TeamContext.Provider>
  );
};
