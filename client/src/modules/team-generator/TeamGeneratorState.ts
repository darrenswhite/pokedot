import {GenerationNum} from '@pkmn/types';

import {
  DEFAULT_MAXIMUM_BASE_STAT_TOTAL,
  DEFAULT_MINIMUM_BASE_STAT_TOTAL,
} from './TeamGeneratorProvider';

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
  const minBST = pool.minimumBaseStatTotal;
  const maxBST = pool.maximumBaseStatTotal;
  const hasMinBST = minBST !== DEFAULT_MINIMUM_BASE_STAT_TOTAL;
  const hasMaxBST = maxBST !== DEFAULT_MAXIMUM_BASE_STAT_TOTAL;

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

  if (hasMinBST) {
    options.push(`min. ${minBST}BST`);
  }

  if (hasMaxBST) {
    options.push(`max. ${maxBST}BST`);
  }

  return options.length > 0 ? options.join(', ') : 'None';
};
