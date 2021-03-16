import {Dex, PokemonSet} from '@pkmn/dex';
import {
  AbilityName,
  EggGroup,
  GenerationNum,
  Move,
  Species,
  SpeciesAbility,
  StatsTable,
  TypeName,
} from '@pkmn/dex-types';
import {Generation, Generations, Type} from '@pkmn/data';

export interface Moves {
  [key: string]: Move | undefined;
}

export type TypeChart = Record<TypeName, number>;

type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

export type PartialPokemonSet = PartialExcept<PokemonSet, 'species'>;

export class PokeInfo {
  private readonly generation: Generation;
  private readonly species: Species;
  readonly resistances: TypeChart;
  readonly types: Type[];

  private constructor(
    generation: Generation,
    species: Species,
    resistances: TypeChart,
    types: Type[]
  ) {
    this.generation = generation;
    this.species = species;
    this.resistances = resistances;
    this.types = types;
  }

  static forSpecies(name: string, gen: GenerationNum = 8): PokeInfo {
    const generation = new Generations(Dex).get(gen);
    const specie = generation.species.get(
      name.replace('[\\W_]+', '').toLowerCase()
    );

    if (specie) {
      const types = specie.types
        .map(type => generation.types.get(type))
        .filter(type => !!type) as Type[];
      const resistances = PokeInfo.createResistanceTypeChart(generation, types);

      return new PokeInfo(generation, specie, resistances, types);
    } else {
      throw new Error(`Unknown species: ${name}`);
    }
  }

  static names(gen: GenerationNum = 8): string[] {
    const generation = new Generations(Dex).get(gen);

    return Array.from(generation.species).map(specie => specie.name);
  }

  static types(gen: GenerationNum = 8): Type[] {
    const generation = new Generations(Dex).get(gen);

    return Array.from(generation.types);
  }

  get name(): string {
    return this.species.name;
  }

  get num(): number {
    return this.species.num;
  }

  get baseStats(): StatsTable<number> {
    return this.species.baseStats;
  }

  get abilities(): SpeciesAbility<'' | AbilityName> {
    return this.species.abilities;
  }

  get eggGroups(): EggGroup[] {
    return this.species.eggGroups;
  }

  async moves(): Promise<Moves> {
    const learnset = (await this.generation.learnsets.get(this.name))?.learnset;
    let moves;

    if (learnset) {
      moves = Object.fromEntries(
        Object.keys(learnset).map(name => [
          name,
          this.generation.moves.get(name),
        ])
      );
    } else {
      moves = {};
    }

    return moves;
  }

  coverage(moves: string[]): TypeChart {
    const coverage = {} as TypeChart;
    const damageMoves = moves
      .map(move => this.generation.moves.get(move))
      .filter(
        move => move !== undefined && move.category !== 'Status'
      ) as Move[];

    damageMoves.forEach(move => {
      Array.from(this.generation.types).forEach(type => {
        const effectiveness = this.generation.types
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

    return coverage;
  }

  private static createResistanceTypeChart(
    generation: Generation,
    types: Type[]
  ): TypeChart {
    const resistances = {} as TypeChart;

    Array.from(generation.types).forEach(type => {
      const values: number[] = types.map(targetType =>
        type.totalEffectiveness(targetType.name)
      );
      const total = values.reduce((prev, curr) => prev * curr, 1);

      resistances[type.name] = total;
    });

    return resistances;
  }
}
