import {TypeName} from '@pkmn/dex-types';
import {PartialPokemonSet, PokeInfo} from '../../info/PokeInfo';
import {flow, groupBy, identity, map, mapValues} from 'lodash/fp';

export interface SpeciesTypeResistance {
  species: string;
  type: TypeName;
  resistance: number;
}

export type GroupedSpeciesTypeResistance<
  K extends keyof SpeciesTypeResistance,
  T
> = Record<SpeciesTypeResistance[K], T>;

export type SpeciesTypeResistanceRows<
  Row extends keyof SpeciesTypeResistance,
  Col extends keyof SpeciesTypeResistance,
  Val extends keyof SpeciesTypeResistance
> = GroupedSpeciesTypeResistance<
  Row,
  GroupedSpeciesTypeResistance<
    Col,
    SpeciesTypeResistance[Val] | SpeciesTypeResistance[Val][]
  >
>;

export type SpeciesTypeResistanceCells<
  Row extends keyof SpeciesTypeResistance,
  Col extends keyof SpeciesTypeResistance
> = GroupedSpeciesTypeResistance<
  Row,
  GroupedSpeciesTypeResistance<Col, SpeciesTypeResistance>
>;

export class ResistanceMatrix {
  private matrix: SpeciesTypeResistance[];

  private constructor(matrix: SpeciesTypeResistance[]) {
    this.matrix = matrix;
  }

  static forPokemon(pokemonSets: PartialPokemonSet[]): ResistanceMatrix {
    return new ResistanceMatrix(ResistanceMatrix.buildMatrix(pokemonSets));
  }

  private static buildMatrix(
    pokemonSets: PartialPokemonSet[]
  ): SpeciesTypeResistance[] {
    const types = PokeInfo.types().map(type => type.name);

    return pokemonSets.flatMap(pokemon => {
      const {species} = pokemon;
      const resistances = PokeInfo.forSpecies(species).resistances;

      return types.map(type => {
        const resistance = resistances[type];

        return {
          species,
          type,
          resistance,
        };
      });
    });
  }

  get values(): SpeciesTypeResistance[] {
    return this.matrix;
  }

  transform(
    func: (matrix: SpeciesTypeResistance[]) => SpeciesTypeResistance[]
  ): ResistanceMatrix {
    return new ResistanceMatrix(func(this.matrix));
  }

  scoreTypes(
    scoringFunction: (values: number[]) => number
  ): [TypeName, number][] {
    return Object.entries(this.groupBy('type')).map(([type, values]) => {
      const score = flow(
        map((val: SpeciesTypeResistance) => val.resistance),
        scoringFunction
      )(values);

      return [type, score];
    }) as [TypeName, number][];
  }

  groupBy<
    K1 extends keyof SpeciesTypeResistance,
    K2 extends keyof SpeciesTypeResistance
  >(
    k1: K1,
    k2: K2
  ): GroupedSpeciesTypeResistance<
    K1,
    GroupedSpeciesTypeResistance<K2, SpeciesTypeResistance[]>
  >;

  groupBy<K1 extends keyof SpeciesTypeResistance>(
    k1: K1
  ): GroupedSpeciesTypeResistance<K1, SpeciesTypeResistance[]>;

  groupBy(...keys: (keyof SpeciesTypeResistance)[]): unknown {
    return this.groupMultiple(
      this.matrix,
      ...keys
    ) as GroupedSpeciesTypeResistance<
      keyof SpeciesTypeResistance,
      SpeciesTypeResistance
    >;
  }

  private groupMultiple<T, K extends keyof T, R>(
    value: T,
    ...keys: (keyof SpeciesTypeResistance)[]
  ): Record<K, R> {
    const key = keys[0];
    const rest = keys.slice(1);

    return flow([
      groupBy(key),
      mapValues(
        rest.length > 0
          ? (values: Record<K, T>) => this.groupMultiple(values, ...rest)
          : identity
      ),
    ])(value);
  }

  private getResistanceScore(value: number): number {
    switch (value) {
      case 0.0:
        return 8;
      case 0.25:
        return 4;
      case 0.5:
        return 2;
      case 1.0:
        return 1;
      case 2.0:
        return -2;
      case 4.0:
        return -4;
      default:
        throw new Error(`Unknown resistance value: ${value}`);
    }
  }
}
