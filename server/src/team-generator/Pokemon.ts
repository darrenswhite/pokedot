import {Schema, type} from '@colyseus/schema';

export class Pokemon extends Schema {
  @type('string')
  species: string;

  constructor(species: string) {
    super();
    this.species = species;
  }
}
