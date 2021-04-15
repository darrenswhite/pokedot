import {Schema, type} from '@colyseus/schema';

export class Pokemon extends Schema {
  @type('number')
  num: number;

  @type('string')
  name: string;

  constructor(num: number, name: string) {
    super();
    this.num = num;
    this.name = name;
  }
}
