import {MapSchema, Schema, type} from '@colyseus/schema';

import {Options, OptionsProps} from './Options';
import {Player} from './Player';

export class TeamGeneratorState extends Schema {
  @type(Options)
  options;

  @type({map: Player})
  players = new MapSchema<Player>();

  constructor(optionsProps: OptionsProps) {
    super();
    this.options = new Options(optionsProps);
  }
}
