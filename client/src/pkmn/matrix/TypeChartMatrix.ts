import {TypeName} from '@pkmn/types';
import {flow, map} from 'lodash/fp';

import {PartialPokemonSet, PokeInfo, TypeChart} from '../PokeInfo';

import {Matrix} from './Matrix';

export interface TypeChartMatrixProps {
  species: string;
  type: TypeName;
  effectiveness: number;
}

export type TypeChartFunction = (info: PokeInfo) => TypeChart;

export abstract class TypeChartMatrix extends Matrix<TypeChartMatrixProps> {
  protected static async buildMatrix(
    pokemonSets: PartialPokemonSet[],
    typeChartFunction: TypeChartFunction
  ): Promise<TypeChartMatrixProps[]> {
    const types = await PokeInfo.types();
    const infos = await Promise.all(
      pokemonSets.map(pokemon => PokeInfo.forPokemonSet(pokemon))
    );

    return infos.flatMap(info => {
      const species = info.species;
      const typeChart = typeChartFunction(info);

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
