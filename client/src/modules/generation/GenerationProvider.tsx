import {Data, Generation} from '@pkmn/data';
import {Dex} from '@pkmn/dex-types';
import axios from 'axios';
import {noop} from 'lodash/fp';
import React, {createContext, useEffect, useState} from 'react';
import {UsageStatistics} from 'smogon';

import {serverUrl} from '../../util/constants';

const DEFAULT_EXISTS = (d: Data): boolean => {
  let exists;

  if (!d.exists) {
    exists = false;
  } else if ('isNonstandard' in d && d.isNonstandard) {
    exists = false;
  } else if (d.kind === 'Ability' && d.id === 'noability') {
    exists = false;
  } else {
    exists = !('tier' in d && ['Illegal', 'Unreleased'].includes(d.tier));
  }

  return exists;
};

export const initialState = (): GenerationContextProps => ({
  dex: null,
  generation: null,
  formats: {},
  format: ['gen8vgc2021', 1760],
  setFormat: noop,
  stats: {
    info: {
      'team type': null,
      cutoff: -1,
      'cutoff deviation': 0,
      metagame: '',
      'number of battles': -1,
    },
    data: {},
  },
});

export interface GenerationContextProps {
  dex: Dex | null;
  generation: Generation | null;
  format: [string, number];
  formats: Record<string, number[]>;
  setFormat: (format: [string, number]) => void;
  stats: UsageStatistics;
}

export const GenerationContext = createContext<GenerationContextProps>(
  initialState()
);

const loadDex = async (): Promise<Dex> => {
  const {Dex} = await import('@pkmn/dex');

  return Dex;
};

const loadFormats = async (): Promise<Record<string, number[]>> => {
  const latest = await axios.get(`${serverUrl}/stats/formats/latest`);

  return latest.data;
};

const loadStats = async (
  format: [string, number]
): Promise<UsageStatistics> => {
  const latest = await axios.get(
    `${serverUrl}/stats/latest/${format[0]}?weight=${format[1]}`
  );

  return latest.data;
};

export interface GenerationProviderProps {
  children: NonNullable<React.ReactNode>;
}

export const GenerationProvider: React.FC<GenerationProviderProps> = ({
  children,
}: GenerationProviderProps) => {
  const [dex, setDex] = useState(initialState().dex);
  const [formats, setFormats] = useState(initialState().formats);
  const [format, setFormat] = useState(initialState().format);
  const [stats, setStats] = useState(initialState().stats);
  const [generation, setGeneration] = useState(initialState().generation);

  useEffect(() => {
    loadDex().then(setDex);
    loadFormats().then(setFormats);
  }, []);

  useEffect(() => {
    loadStats(format).then(setStats);
  }, [format]);

  useEffect(() => {
    if (dex) {
      setGeneration(new Generation(dex, DEFAULT_EXISTS));
    }
  }, [dex]);

  return (
    <GenerationContext.Provider
      value={{dex, generation, formats, format, setFormat, stats}}
    >
      {children}
    </GenerationContext.Provider>
  );
};
