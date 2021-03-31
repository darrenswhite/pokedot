import React, {createContext, useState} from 'react';
import {noop} from 'lodash/fp';

export interface SpeciesContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  species: string;
  setSpecies: (species: string) => void;
}

export const SpeciesContext = createContext<SpeciesContextProps>({
  open: false,
  setOpen: noop,
  species: '',
  setSpecies: noop,
});

export interface SpeciesProviderProps {
  children: NonNullable<React.ReactNode>;
}

export const SpeciesProvider: React.FC<SpeciesProviderProps> = ({
  children,
}: SpeciesProviderProps) => {
  const [open, setOpen] = useState(false);
  const [species, setSpecies] = useState('');

  return (
    <SpeciesContext.Provider value={{open, setOpen, species, setSpecies}}>
      {children}
    </SpeciesContext.Provider>
  );
};
