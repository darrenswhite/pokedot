import {Generation, Generations, Specie} from '@pkmn/data';
import {
  AbilityName,
  EggGroup,
  GenerationNum,
  Move,
  PokemonSet,
  StatsTable,
  TypeName,
} from '@pkmn/dex-types';
import {map} from 'lodash/fp';

export type TypeChart = Record<TypeName, number>;

type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

export type PartialPokemonSet = PartialExcept<PokemonSet, 'species'>;

export const STAT_NAMES: StatsTable<string> = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe',
};

const MYTHICALS = [
  'mew',
  'celebi',
  'jirachi',
  'deoxys',
  'phione',
  'manaphy',
  'darkrai',
  'shaymin',
  'arceus',
  'victini',
  'keldeo',
  'meloetta',
  'genesect',
  'diancie',
  'hoopa',
  'volcanion',
  'magearna',
  'marshadow',
  'zeraora',
  'meltan',
  'melmetal',
  'zarude',
];

const LEGENDS = [
  'mewtwo',
  'lugia',
  'hooh',
  'kyogre',
  'groudon',
  'rayquaza',
  'dialga',
  'palkia',
  'giratina',
  'reshiram',
  'zekrom',
  'kyurem',
  'xerneas',
  'yveltal',
  'zygarde',
  'cosmog',
  'cosmoem',
  'solgaleo',
  'lunala',
  'necrozma',
  'zacian',
  'zamazenta',
  'eternatus',
  'calyrex',
];

const SUB_LEGENDS = [
  'articuno',
  'zapdos',
  'moltres',
  'raikou',
  'entei',
  'suicune',
  'regirock',
  'regice',
  'registeel',
  'latias',
  'latios',
  'uxie',
  'mesprit',
  'azelf',
  'heatran',
  'regigigas',
  'cresselia',
  'cobalion',
  'terrakion',
  'virizion',
  'tornadus',
  'thundurus',
  'landorus',
  'typenull',
  'silvally',
  'tapukoko',
  'tapulele',
  'tapubulu',
  'tapufini',
  'nihilego',
  'buzzwole',
  'pheromosa',
  'xurkitree',
  'celesteela',
  'kartana',
  'guzzlord',
  'poipole',
  'naganadel',
  'stakataka',
  'blacephalon',
  'kubfu',
  'urshifu',
  'regieleki',
  'regidrago',
  'glastrier',
  'spectrier',
];

export class PokeInfo {
  private specie: Specie;
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
      throw new Error(`Unknown species: ${species}`);
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

  get types(): TypeName[] {
    return this.specie.types;
  }

  get id(): string {
    return this.specie.id;
  }

  get isLegendary(): boolean {
    return LEGENDS.includes(this.id) || SUB_LEGENDS.includes(this.id);
  }

  get isMythical(): boolean {
    return MYTHICALS.includes(this.id);
  }

  private static createCoverageTypeChart(
    generation: Generation,
    moves: string[] | undefined
  ): TypeChart {
    const damageMoves = (moves
      ?.map(move => generation.moves.get(move))
      .filter(move => move !== undefined && move.category !== 'Status') ??
      []) as Move[];

    return Object.fromEntries(
      Array.from(generation.types).map(type => {
        const total = damageMoves
          .map(move => {
            return (
              generation.types.get(move.type)?.totalEffectiveness(type.name) ??
              0.0
            );
          })
          .reduce((prev, curr) => (curr > prev ? curr : prev), 0.0);

        return [type, total];
      })
    );
  }

  private static createResistanceTypeChart(
    generation: Generation,
    types: TypeName[]
  ): TypeChart {
    return Object.fromEntries(
      Array.from(generation.types).map(type => {
        const values: number[] = types.map(targetType =>
          type.totalEffectiveness(targetType)
        );
        const total = values.reduce((prev, curr) => prev * curr, 1);

        return [type, total];
      })
    );
  }
}
