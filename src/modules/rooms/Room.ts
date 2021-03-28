import {GenerationNum} from '@pkmn/types';

export type RoomId = string;
export type PlayerId = string;

export const ROOM_ID_LENGTH = 4;

export interface Room {
  id: RoomId;
  options: RoomOptions;
  players: Record<PlayerId, Player>;
}

export interface RoomOptions {
  teamSize: number;
  poolSize: number;
  legendaries: number;
  mythicals: number;
  exclusivePools: boolean;
  gen?: GenerationNum;
}

export interface Player {
  id: PlayerId;
  name: string;
  team: Pokemon[];
}

export interface Pokemon {
  species: string;
}
