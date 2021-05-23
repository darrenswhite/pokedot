import {Schema, type} from '@colyseus/schema';

export class Pokemon extends Schema {
  @type('number')
  num: number;

  @type('string')
  name: string;

  @type('string')
  baseSpecies: string;

  @type('string')
  form: string;

  constructor(num: number, name: string, baseSpecies: string, form: string) {
    super();
    this.num = num;
    this.name = name;
    this.baseSpecies = baseSpecies;
    this.form = form;
  }
}
