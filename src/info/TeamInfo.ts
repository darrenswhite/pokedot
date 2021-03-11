import {PokemonSet, Team} from '@pkmn/sets';
import {PokeInfo} from './PokeInfo';

export interface PokemonSetInfo extends PokemonSet {
  info: PokeInfo;
}

export class TeamInfo {
  readonly team: PokemonSetInfo[];

  private constructor(team: PokemonSetInfo[]) {
    this.team = team;
  }

  static async fromString(str: string): Promise<TeamInfo> {
    const parsedTeam = Team.fromString(str);

    if (parsedTeam) {
      const team = await Promise.all(
        parsedTeam.team.map(async pokemon => {
          return {
            ...pokemon,
            info: await PokeInfo.forSpecies(pokemon.species),
          };
        })
      );

      return new TeamInfo(team);
    } else {
      throw new Error('Failed to parse team.');
    }
  }
}
