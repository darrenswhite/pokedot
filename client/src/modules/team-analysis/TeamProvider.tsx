import {PokemonSet} from '@pkmn/data';
import {Patch} from 'immer';
import {noop} from 'lodash/fp';
import React, {createContext, useState} from 'react';

export interface Change {
  patches: Patch[];
  inversePatches: Patch[];
}

export interface TeamContextProps {
  team: PokemonSet[];
  setTeam: (team: PokemonSet[]) => void;
  changes: Record<number, Change>;
  setChanges: (changes: Record<number, Change>) => void;
  currentChange: number;
  setCurrentChange: (currentChange: number) => void;
}

export const TeamContext = createContext<TeamContextProps>({
  team: [],
  setTeam: noop,
  changes: [],
  setChanges: noop,
  currentChange: -1,
  setCurrentChange: noop,
});

export interface TeamProviderProps {
  children: NonNullable<React.ReactNode>;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({
  children,
}: TeamProviderProps) => {
  const [team, setTeam] = useState<PokemonSet[]>([]);
  const [changes, setChanges] = useState<Record<number, Change>>({});
  const [currentChange, setCurrentChange] = useState<number>(-1);

  return (
    <TeamContext.Provider
      value={{
        team,
        setTeam,
        changes,
        setChanges,
        currentChange,
        setCurrentChange,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
