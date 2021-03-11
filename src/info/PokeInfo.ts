import {Dex} from '@pkmn/dex';
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

export type TypeChart = Partial<Record<TypeName, number>>;

export class PokeInfo {
  private readonly generation: Generation;
  private readonly species: Species;
  readonly moves: Moves;
  readonly resistances: TypeChart;
  readonly types: Type[];

  private constructor(
    generation: Generation,
    species: Species,
    moves: Moves,
    resistances: TypeChart,
    types: Type[]
  ) {
    this.generation = generation;
    this.species = species;
    this.moves = moves;
    this.resistances = resistances;
    this.types = types;
  }

  static async forSpecies(
    name: string,
    gen: GenerationNum = 8
  ): Promise<PokeInfo> {
    const generation = new Generations(Dex).get(gen);
    const specie = generation.species.get(
      name.replace('[\\W_]+', '').toLowerCase()
    );

    if (specie) {
      const learnset = (await generation.learnsets.get(specie.name))?.learnset;
      const types = specie.types
        .map(type => generation.types.get(type))
        .filter(type => !!type) as Type[];
      const resistances = PokeInfo.createResistanceTypeChart(generation, types);
      let moves;

      if (learnset) {
        moves = Object.fromEntries(
          Object.keys(learnset).map(name => [name, generation.moves.get(name)])
        );
      } else {
        moves = {};
      }

      return new PokeInfo(generation, specie, moves, resistances, types);
    } else {
      throw new Error(`Unknown species: ${name}`);
    }
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
