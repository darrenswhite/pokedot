import {Generation} from '@pkmn/data';
import {TypeName} from '@pkmn/types';
import {flow, map} from 'lodash/fp';

import {PartialPokemonSet} from '../PartialPokemonSet';

import {Matrix} from './Matrix';

export interface TypeChartMatrixProps {
  species: string;
  type: TypeName;
  effectiveness: number;
}

export type TypeChart = Record<TypeName, number>;

export type TypeChartFunction = (
  generation: Generation,
  pokemon: PartialPokemonSet
) => TypeChart;

export abstract class TypeChartMatrix extends Matrix<TypeChartMatrixProps> {
  protected static buildMatrix(
    generation: Generation,
    pokemonSets: PartialPokemonSet[],
    typeChartFunction: TypeChartFunction
  ): TypeChartMatrixProps[] {
    const types = Array.from(generation.types).map(type => type.name);

    return pokemonSets.flatMap(pokemon => {
      const species = pokemon.species;
      const typeChart = typeChartFunction(generation, pokemon);

      return types.map(type => {
        const effectiveness = typeChart[type];

        return {
          species,
          type,
          effectiveness,
        };
      });
    });
  }

  scoreTypes(
    scoringFunction: (values: number[]) => number
  ): [TypeName, number][] {
    const groupByType = this.groupBy('type');

    return Object.entries(groupByType).map(([type, values]) => {
      const score = flow(
        map((val: TypeChartMatrixProps) => val.effectiveness),
        scoringFunction
      )(values);

      return [type as TypeName, score];
    });
  }
}
