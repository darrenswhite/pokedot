import {MapSchema} from '@colyseus/schema';

import {Options} from '../../src/team-generator/Options';
import {Player} from '../../src/team-generator/Player';
import {TeamGeneratorState} from '../../src/team-generator/TeamGeneratorState';

describe('TeamGeneratorState', () => {
  describe('#constructor()', () => {
    it('should create a new instance', () => {
      const options = {
        teamSize: 6,
        poolSize: 3,
        poolSelectionTime: 30000,
        legendaries: 1,
        mythicals: 2,
        exclusivePools: true,
        gen: 8,
      };

      const state = new TeamGeneratorState(
        new Options(
          options.teamSize,
          options.poolSize,
          options.poolSelectionTime,
          options.legendaries,
          options.mythicals,
          options.exclusivePools,
          options.gen
        )
      );

      expect(state.options).toEqual(options);
      expect(state.players).toStrictEqual(new MapSchema<Player>());
    });
  });
});
