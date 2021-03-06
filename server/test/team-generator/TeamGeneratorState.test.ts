import {ArraySchema, MapSchema} from '@colyseus/schema';

import {Options} from '../../src/team-generator/Options';
import {Player} from '../../src/team-generator/Player';
import {Pool} from '../../src/team-generator/Pool';
import {TeamGeneratorState} from '../../src/team-generator/TeamGeneratorState';

describe('TeamGeneratorState', () => {
  describe('#constructor()', () => {
    it('should create a new instance', () => {
      const options = {
        pools: new ArraySchema<Pool>(),
        poolSelectionTime: 30000,
        exclusivePools: true,
        gen: 8,
      } as Options;

      const state = new TeamGeneratorState(
        new Options(
          options.pools,
          options.poolSize,
          options.poolSelectionTime,
          options.exclusivePools,
          options.gen
        )
      );

      expect(state.options).toEqual(options);
      expect(state.players).toStrictEqual(new MapSchema<Player>());
    });
  });
});
