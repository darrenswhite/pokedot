import {GenerationNum} from '@pkmn/types';

export interface TeamGeneratorState {
  options: Options;
  players: Record<string, Player>;
  currentPool: number;
  currentPoolTime: number;
}

export interface Options {
  teamSize: number;
  poolSize: number;
  poolSelectionTime: number;
  legendaries: number;
  mythicals: number;
  exclusivePools: boolean;
  gen: GenerationNum;
}

export interface Player {
  id: string;
  name: string;
  team: Pokemon[];
  pool: Pokemon[];
  ready: boolean;
  connected: boolean;
}

export interface Pokemon {
  num: number;
  name: string;
  baseSpecies: string;
}
