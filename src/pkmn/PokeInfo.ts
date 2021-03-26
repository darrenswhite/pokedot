import {
  AbilityName,
  EggGroup,
  GenerationNum,
  Move,
  PokemonSet,
  StatsTable,
  TypeName,
} from '@pkmn/dex-types';
import {Generation, Generations, Specie} from '@pkmn/data';
import {map} from 'lodash/fp';

export type TypeChart = Partial<Record<TypeName, number>>;

type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

export type PartialPokemonSet = PartialExcept<PokemonSet, 'species'>;

export class PokeInfo {
  specie: Specie;
  resistances: TypeChart;
  coverage: TypeChart;

  private constructor(
    specie: Specie,
    resistances: TypeChart,
    coverage: TypeChart
  ) {
    this.specie = specie;
    this.resistances = resistances;
    this.coverage = coverage;
  }

  static async forSpecies(
    species: string,
    gen?: GenerationNum
  ): Promise<PokeInfo> {
    return PokeInfo.forPokemonSet({species}, gen);
  }

  static async forPokemonSet(
    set: PartialPokemonSet,
    gen?: GenerationNum
  ): Promise<PokeInfo> {
    const generation = await PokeInfo.getGeneration(gen);
    const species = set.species.replace('[\\W_]+', '').toLowerCase();
    const specie = generation.species.get(species);

    if (specie) {
      const types = specie.types;
      const resistances = PokeInfo.createResistanceTypeChart(generation, types);
      const coverage = PokeInfo.createCoverageTypeChart(generation, set.moves);

      return new PokeInfo(specie, resistances, coverage);
    } else {
      throw new Error(`Unknown species: ${name}`);
    }
  }

  static async species(gen?: GenerationNum): Promise<string[]> {
    const generation = await PokeInfo.getGeneration(gen);

    return Array.from(generation.species).map(specie => specie.name);
  }

  static async types(gen?: GenerationNum): Promise<TypeName[]> {
    const generation = await PokeInfo.getGeneration(gen);

    return map(type => type.name, Array.from(generation.types));
  }

  private static async getGeneration(
    gen: GenerationNum = 8
  ): Promise<Generation> {
    const {Dex} = await import('@pkmn/dex');

    return new Generations(Dex).get(gen);
  }

  get species(): string {
    return this.specie.name;
  }

  get num(): number {
    return this.specie.num;
  }

  get baseStats(): StatsTable<number> {
    return this.specie.baseStats;
  }

  get abilities(): AbilityName[] {
    return Object.values(this.specie.abilities);
  }

  get eggGroups(): EggGroup[] {
    return this.specie.eggGroups;
  }

  private static createCoverageTypeChart(
    generation: Generation,
    moves: string[] | undefined
  ): TypeChart {
    const coverage: TypeChart = {};

    if (moves) {
      const damageMoves = moves
        .map(move => generation.moves.get(move))
        .filter(
          move => move !== undefined && move.category !== 'Status'
        ) as Move[];

      damageMoves.forEach(move => {
        Array.from(generation.types).forEach(type => {
          const effectiveness = generation.types
            .get(move.type)
            ?.totalEffectiveness(type.name);

          if (effectiveness !== undefined) {
            const curr = coverage[type.name];

            if (curr === undefined || effectiveness > curr) {
              coverage[type.name] = effectiveness;
            }
          }
        });
      });
    }

    return coverage;
  }

  private static createResistanceTypeChart(
    generation: Generation,
    types: TypeName[]
  ): TypeChart {
    const resistances: TypeChart = {};

    Array.from(generation.types).forEach(type => {
      const values: number[] = types.map(targetType =>
        type.totalEffectiveness(targetType)
      );
      const total = values.reduce((prev, curr) => prev * curr, 1);

      resistances[type.name] = total;
    });

    return resistances;
  }
}
