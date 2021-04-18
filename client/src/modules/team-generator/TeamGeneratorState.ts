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

export const getPoolOptionsDisplay = (pool: Pool): string => {
  const options = [];

  if (pool.fullyEvolved) {
    options.push('FE');
  }

  if (pool.notFullyEvolved) {
    options.push('NFE');
  }

  if (pool.restrictedLegendaries) {
    options.push('RL');
  }

  if (pool.subLegendaries) {
    options.push('SL');
  }

  if (pool.mythicals) {
    options.push('M');
  }

  if (pool.minimumBaseStatTotal > 0 && pool.maximumBaseStatTotal > 0) {
    options.push(
      `${pool.minimumBaseStatTotal}>=BST<=${pool.maximumBaseStatTotal}`
    );
  } else if (pool.minimumBaseStatTotal > 0) {
    options.push(`BST>=${pool.minimumBaseStatTotal}`);
  } else if (pool.maximumBaseStatTotal > 0) {
    options.push(`BST<=${pool.maximumBaseStatTotal}`);
  }

  return options.length > 0 ? options.join(', ') : 'None';
};
