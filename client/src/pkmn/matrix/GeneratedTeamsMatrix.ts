import {find, range} from 'lodash/fp';

import {PokeInfo} from '../PokeInfo';
import {GeneratedTeam, TeamGeneratorOptions} from '../TeamGenerator';

import {Matrix} from './Matrix';

export interface GeneratedTeamsMatrixProps {
  player: string;
  index: number;
  info: PokeInfo;
}

export class GeneratedTeamsMatrix extends Matrix<GeneratedTeamsMatrixProps> {
  static forTeams(
    teams: GeneratedTeam[],
    options: TeamGeneratorOptions
  ): GeneratedTeamsMatrix {
    return new GeneratedTeamsMatrix(
      options.players.flatMap(player => {
        const playerTeam = find(team => team.player === player, teams);
        const team = playerTeam?.team ?? Array(options.sampleSize);

        return range(0, options.sampleSize).map(index => ({
          player,
          index,
          info: team[index],
        }));
      })
    );
  }
}
