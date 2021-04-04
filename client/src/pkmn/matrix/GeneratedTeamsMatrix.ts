import {
  Pokemon,
  TeamGeneratorState,
} from '../../modules/team-generator/TeamGeneratorState';

import {Matrix} from './Matrix';

export interface GeneratedTeamsMatrixProps {
  playerName: string;
  pool: number;
  pokemon: Pokemon;
}

export class GeneratedTeamsMatrix extends Matrix<GeneratedTeamsMatrixProps> {
  static forState(state: TeamGeneratorState): GeneratedTeamsMatrix {
    return new GeneratedTeamsMatrix(
      Object.values(state.players).flatMap(player => {
        const playerName = player.name;

        return player.team.map((pokemon, pool) => ({
          playerName,
          pool,
          pokemon,
        }));
      })
    );
  }
}
