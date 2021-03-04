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

export type ResistanceTypeChart = Partial<Record<TypeName, number>>;

export class PokeInfo {
  private readonly species: Species;
  readonly moves: Moves;
  readonly resistances: ResistanceTypeChart;
  readonly types: Type[];

  private constructor(
    species: Species,
    moves: Moves,
    resistances: ResistanceTypeChart,
    types: Type[]
  ) {
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

      return new PokeInfo(specie, moves, resistances, types);
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

  private static createResistanceTypeChart(
    generation: Generation,
    types: Type[]
  ): ResistanceTypeChart {
    const resistances = {} as ResistanceTypeChart;

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
