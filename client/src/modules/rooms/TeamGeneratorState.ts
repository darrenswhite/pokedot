import {ArraySchema, MapSchema} from '@colyseus/schema';
import {GenerationNum} from '@pkmn/types';

export interface TeamGeneratorState {
  options: TeamGeneratorOptions;
  players: MapSchema<Player>;
  currentPool: number;
  currentPoolTime: number;
}

export interface TeamGeneratorOptions {
  teamSize: number;
  poolSize: number;
  poolSelectionTime: number;
  legendaries: number;
  mythicals: number;
  exclusivePools: boolean;
  gen?: GenerationNum;
}

export interface Player {
  id: string;
  name: string;
  team: ArraySchema<Pokemon>;
  pool: ArraySchema<Pokemon>;
  ready: boolean;
  connected: boolean;
}

export interface Pokemon {
  species: string;
}
