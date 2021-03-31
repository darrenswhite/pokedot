import {ArraySchema, Schema, type} from '@colyseus/schema';

import {Pokemon, PokemonProps} from './Pokemon';

export interface PlayerProps {
  id: string;
  name: string;
  team: PokemonProps[];
  ready: boolean;
  connected: boolean;
}

export class Player extends Schema {
  @type('string')
  id: string;

  @type('string')
  name: string;

  @type([Pokemon])
  team: ArraySchema<Pokemon>;

  @type('boolean')
  ready: boolean;

  @type('boolean')
  connected: boolean;

  constructor(props: PlayerProps) {
    super();
    this.id = props.id;
    this.name = props.name;
    this.team = new ArraySchema<Pokemon>(
      ...props.team.map(pokemonProps => new Pokemon(pokemonProps))
    );
    this.ready = props.ready;
    this.connected = props.connected;
  }
}
