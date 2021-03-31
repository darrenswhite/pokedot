import {MapSchema} from '@colyseus/schema';

import {OptionsProps} from '../../src/team-generator/Options';
import {Player} from '../../src/team-generator/Player';
import {TeamGeneratorState} from '../../src/team-generator/TeamGeneratorState';

describe('TeamGeneratorState', () => {
  describe('#constructor()', () => {
    it('should create a new instance', () => {
      const optionsProps: OptionsProps = {
        teamSize: 6,
        poolSize: 3,
        legendaries: 1,
        mythicals: 2,
        exclusivePools: true,
        gen: 8,
      };

      const state = new TeamGeneratorState(optionsProps);

      expect(state.options.teamSize).toEqual(optionsProps.teamSize);
      expect(state.players).toStrictEqual(new MapSchema<Player>());
    });
  });
});
