import {GenerationNum} from '@pkmn/types';
import {filter, map, sampleSize} from 'lodash/fp';
import {PokeInfo} from './PokeInfo';

export interface GeneratedTeam {
  player: string;
  team: PokeInfo[];
}

export interface TeamGeneratorOptions {
  players: string[];
  sampleSize: number;
  reveal: number;
  legendaries: number;
  mythicals: number;
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

  sampleLegendaryPokemon(): PokeInfo[] {
    return this.samplePokemon(
      this.options.legendaries,
      info => info.isLegendary
    );
  }

  sampleMythicalPokemon(): PokeInfo[] {
    return this.samplePokemon(this.options.mythicals, info => info.isMythical);
  }

  samplePokemon(
    size: number,
    isValid?: (infos: PokeInfo) => boolean
  ): PokeInfo[] {
    return sampleSize(
      size,
      isValid ? filter(isValid, this.pokeInfos) : this.pokeInfos
    );
  }

  generateTeam(): PokeInfo[] {
    const legendaries = this.sampleLegendaryPokemon();
    const mythicals = this.sampleMythicalPokemon();
    const rest = this.samplePokemon(
      this.options.sampleSize - legendaries.length - mythicals.length
    );

    return [...legendaries, ...mythicals, ...rest];
  }

  generateTeams(): GeneratedTeam[] {
    return map(
      player => ({
        player,
        team: this.generateTeam(),
      }),
      this.options.players
    );
  }
}
