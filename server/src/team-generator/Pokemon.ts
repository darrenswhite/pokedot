import {Schema, type} from '@colyseus/schema';

export interface PokemonProps {
  species: string;
}

export class Pokemon extends Schema {
  @type('string')
  species: string;

  constructor(props: PokemonProps) {
    super();
    this.species = props.species;
  }
}
