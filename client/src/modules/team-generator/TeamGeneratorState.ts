import {GenerationNum} from '@pkmn/types';

export interface TeamGeneratorState {
  options: Options;
  players: Record<string, Player>;
  currentPool: number;
  currentPoolTime: number;
}

export interface Options {
  pools: Pool[];
  poolSize: number;
  poolSelectionTime: number;
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
}

export interface Pool {
  fullyEvolved: boolean;
  notFullyEvolved: boolean;
  restrictedLegendaries: boolean;
  subLegendaries: boolean;
  mythicals: boolean;
  minimumBaseStatTotal: number;
  maximumBaseStatTotal: number;
}
