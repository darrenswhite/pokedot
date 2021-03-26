import {GenerationNum} from '@pkmn/types';
import {map, sampleSize} from 'lodash/fp';
import {PokeInfo} from './PokeInfo';

export interface RandomGeneratedTeam {
  player: string;
  team: PokeInfo[];
}

export interface RandomTeamGeneratorOptions {
  players: string[];
  sampleSize: number;
  reveal: number;
  gen?: GenerationNum;
}

export class RandomTeamGenerator {
  private pokeInfos: PokeInfo[];
  private options: RandomTeamGeneratorOptions;

  private constructor(
    pokeInfos: PokeInfo[],
    options: RandomTeamGeneratorOptions
  ) {
    this.pokeInfos = pokeInfos;
    this.options = options;
  }

  static async generate(
    options: RandomTeamGeneratorOptions
  ): Promise<RandomGeneratedTeam[]> {
    let teams: RandomGeneratedTeam[];

    if (options.players.length > 0 && options.sampleSize > 0) {
      const species = await PokeInfo.species(options.gen);
      const pokeInfos = await Promise.all(
        species.map(specie => PokeInfo.forSpecies(specie))
      );

      teams = new RandomTeamGenerator(pokeInfos, options).generateTeams();
    } else {
      teams = [];
    }

    return teams;
  }

  samplePokemon(): PokeInfo[] {
    return sampleSize(this.options.sampleSize, this.pokeInfos);
  }

  generateTeams(): RandomGeneratedTeam[] {
    return map(
      player => ({
        player,
        team: this.samplePokemon(),
      }),
      this.options.players
    );
  }
}
