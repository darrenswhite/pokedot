import {Team} from '@pkmn/sets';
import {PokeInfo} from './PokeInfo';

export class TeamInfo {
  readonly team: Team;
  readonly pokeInfo: PokeInfo[];

  private constructor(team: Team, pokeInfo: PokeInfo[]) {
    this.team = team;
    this.pokeInfo = pokeInfo;
  }

  static async fromString(str: string): Promise<TeamInfo> {
    const team = Team.fromString(str);

    if (team) {
      const pokeInfo = await Promise.all(
        team.team.map(pokemon => PokeInfo.forSpecies(pokemon.species))
      );

      return new TeamInfo(team, pokeInfo);
    } else {
      throw new Error('Failed to parse team.');
    }
  }
}
