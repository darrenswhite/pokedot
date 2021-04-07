import {Generation, GenerationNum, Generations} from '@pkmn/data';
import {noop} from 'lodash/fp';
import React, {createContext, useEffect, useState} from 'react';

const DEFAULT_GEN: GenerationNum = 8;

export const initialState = (): GenerationContextProps => ({
  generation: null,
  useGeneration: noop,
});

export interface GenerationContextProps {
  generation: Generation | null;
  useGeneration: (gen: GenerationNum) => void;
}

export const GenerationContext = createContext<GenerationContextProps>(
  initialState()
);

export interface GenerationProviderProps {
  children: NonNullable<React.ReactNode>;
}

export const GenerationProvider: React.FC<GenerationProviderProps> = ({
  children,
}: GenerationProviderProps) => {
  const [generations, setGenerations] = useState<Generations | null>(null);
  const [generation, setGeneration] = useState(initialState().generation);

  const useGeneration = (gen: GenerationNum) => {
    if (generations) {
      setGeneration(generations.get(gen));
    }
  };

  const loadGenerations = async () => {
    const {Dex} = await import('@pkmn/dex');

    setGenerations(new Generations(Dex));
  };

  useEffect(() => {
    loadGenerations();
  }, []);

  useEffect(() => {
    if (generations && !generation) {
      setGeneration(generations.get(DEFAULT_GEN));
    }
  }, [generations, generation]);

  return (
    <GenerationContext.Provider value={{generation, useGeneration}}>
      {children}
    </GenerationContext.Provider>
  );
};
