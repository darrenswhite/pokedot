import {MapSchema, Schema, type} from '@colyseus/schema';

import {Options} from './Options.js';
import {Player} from './Player.js';

export class TeamGeneratorState extends Schema {
  @type(Options)
  options;

  @type({map: Player})
  players = new MapSchema<Player>();

  @type('number')
  currentPool = -1;

  @type('number')
  currentPoolTime = -1;

  constructor(options: Options) {
    super();
    this.options = options;
  }
}
