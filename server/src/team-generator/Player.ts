import {ArraySchema, Schema, type} from '@colyseus/schema';

import {Pokemon} from './Pokemon';

export class Player extends Schema {
  @type('string')
  id: string;

  @type('string')
  name: string;

  @type([Pokemon])
  team: ArraySchema<Pokemon> = new ArraySchema<Pokemon>();

  @type([Pokemon])
  pool: ArraySchema<Pokemon> = new ArraySchema<Pokemon>();

  @type([Pokemon])
  previousPools: ArraySchema<Pokemon> = new ArraySchema<Pokemon>();

  @type('boolean')
  ready = false;

  @type('boolean')
  connected = true;

  constructor(id: string, name: string) {
    super();
    this.id = id;
    this.name = name;
  }
}
