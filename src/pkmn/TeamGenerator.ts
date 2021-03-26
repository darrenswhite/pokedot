import {GenerationNum} from '@pkmn/types';
import {map, sampleSize} from 'lodash/fp';
import {PokeInfo} from './PokeInfo';

export interface GeneratedTeam {
  player: string;
  team: PokeInfo[];
}

export interface TeamGeneratorOptions {
  players: string[];
  sampleSize: number;
  reveal: number;
  gen?: GenerationNum;
}

export class TeamGenerator {
  private pokeInfos: PokeInfo[];
  private options: TeamGeneratorOptions;

  private constructor(pokeInfos: PokeInfo[], options: TeamGeneratorOptions) {
    this.pokeInfos = pokeInfos;
    this.options = options;
  }

  static async generate(
    options: TeamGeneratorOptions
  ): Promise<GeneratedTeam[]> {
    let teams: GeneratedTeam[];

    if (options.players.length > 0 && options.sampleSize > 0) {
      const species = await PokeInfo.species(options.gen);
      const pokeInfos = await Promise.all(
        species.map(specie => PokeInfo.forSpecies(specie))
      );

      teams = new TeamGenerator(pokeInfos, options).generateTeams();
    } else {
      teams = [];
    }

    return teams;
  }

  samplePokemon(): PokeInfo[] {
    return sampleSize(this.options.sampleSize, this.pokeInfos);
  }

  generateTeams(): GeneratedTeam[] {
    return map(
      player => ({
        player,
        team: this.samplePokemon(),
      }),
      this.options.players
    );
  }
}
