import {Schema, type} from '@colyseus/schema';

export class Pool extends Schema {
  @type('boolean')
  fullyEvolved: boolean;

  @type('boolean')
  notFullyEvolved: boolean;

  @type('boolean')
  restrictedLegendaries: boolean;

  @type('boolean')
  subLegendaries: boolean;

  @type('boolean')
  mythicals: boolean;

  @type('number')
  minimumBaseStatTotal: number;

  @type('number')
  maximumBaseStatTotal: number;

  constructor(
    fullyEvolved: boolean,
    notFullyEvolved: boolean,
    restrictedLegendaries: boolean,
    subLegendaries: boolean,
    mythicals: boolean,
    minimumBaseStatTotal: number,
    maximumBaseStatTotal: number
  ) {
    super();
    this.fullyEvolved = fullyEvolved;
    this.notFullyEvolved = notFullyEvolved;
    this.restrictedLegendaries = restrictedLegendaries;
    this.subLegendaries = subLegendaries;
    this.mythicals = mythicals;
    this.minimumBaseStatTotal = minimumBaseStatTotal;
    this.maximumBaseStatTotal = maximumBaseStatTotal;
  }
}
