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
  revealMs: number;
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
    const species = await PokeInfo.species(options.gen);
    const pokeInfos = await Promise.all(
      species.map(specie => PokeInfo.forSpecies(specie))
    );

    return new RandomTeamGenerator(pokeInfos, options).generateTeams();
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
