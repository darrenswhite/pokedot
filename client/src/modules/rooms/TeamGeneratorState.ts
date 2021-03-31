import {GenerationNum} from '@pkmn/types';
import {ArraySchema, MapSchema} from '@colyseus/schema';

export interface TeamGeneratorState {
  options: TeamGeneratorOptions;
  players: MapSchema<Player>;
}

export interface TeamGeneratorOptions {
  teamSize: number;
  poolSize: number;
  legendaries: number;
  mythicals: number;
  exclusivePools: boolean;
  gen?: GenerationNum;
}

export interface Player {
  id: string;
  name: string;
  team: ArraySchema<Pokemon>;
  ready: boolean;
}

export interface Pokemon {
  species: string;
}
