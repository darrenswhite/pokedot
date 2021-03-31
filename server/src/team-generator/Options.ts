import {Schema, type} from '@colyseus/schema';

export interface OptionsProps {
  teamSize: number;
  poolSize: number;
  legendaries: number;
  mythicals: number;
  exclusivePools: boolean;
  gen?: number;
}

export class Options extends Schema {
  @type('number')
  teamSize: number;

  @type('number')
  poolSize: number;

  @type('number')
  legendaries: number;

  @type('number')
  mythicals: number;

  @type('boolean')
  exclusivePools: boolean;

  @type('number')
  gen?: number;

  constructor(props: OptionsProps) {
    super();
    this.teamSize = props.teamSize;
    this.poolSize = props.poolSize;
    this.legendaries = props.legendaries;
    this.mythicals = props.mythicals;
    this.exclusivePools = props.exclusivePools;
    this.gen = props.gen;
  }
}
