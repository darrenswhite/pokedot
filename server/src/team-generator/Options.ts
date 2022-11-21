import {ArraySchema, Schema, type} from '@colyseus/schema';
import {GenerationNum} from '@pkmn/types';

import {Pool} from './Pool.js';

export class Options extends Schema {
  @type([Pool])
  pools: ArraySchema<Pool>;

  @type('number')
  poolSize: number;

  @type('number')
  poolSelectionTime: number;

  @type('boolean')
  exclusivePools: boolean;

  @type('number')
  gen: GenerationNum;

  constructor(
    pools: ArraySchema<Pool>,
    poolSize: number,
    poolSelectionTime: number,
    exclusivePools: boolean,
    gen: GenerationNum
  ) {
    super();
    this.pools = pools;
    this.poolSize = poolSize;
    this.poolSelectionTime = poolSelectionTime;
    this.exclusivePools = exclusivePools;
    this.gen = gen;
  }
}
