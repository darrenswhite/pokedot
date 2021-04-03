import {Schema, type} from '@colyseus/schema';
import {GenerationNum} from '@pkmn/types';

export class Options extends Schema {
  @type('number')
  teamSize: number;

  @type('number')
  poolSize: number;

  @type('number')
  poolSelectionTime: number;

  @type('number')
  legendaries: number;

  @type('number')
  mythicals: number;

  @type('boolean')
  exclusivePools: boolean;

  @type('number')
  gen: GenerationNum;

  constructor(
    teamSize: number,
    poolSize: number,
    poolSelectionTime: number,
    legendaries: number,
    mythicals: number,
    exclusivePools: boolean,
    gen: GenerationNum
  ) {
    super();
    this.teamSize = teamSize;
    this.poolSize = poolSize;
    this.poolSelectionTime = poolSelectionTime;
    this.legendaries = legendaries;
    this.mythicals = mythicals;
    this.exclusivePools = exclusivePools;
    this.gen = gen;
  }
}
