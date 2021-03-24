import {TypeName} from '@pkmn/types';
import {PartialPokemonSet, PokeInfo} from '../info/PokeInfo';
import {flow, map} from 'lodash/fp';
import {Matrix} from './Matrix';

export interface ResistanceMatrixProps {
  species: string;
  type: TypeName;
  resistance: number;
}

export class ResistanceMatrix extends Matrix<ResistanceMatrixProps> {
  static async forPokemonSets(
    pokemonSets: PartialPokemonSet[]
  ): Promise<ResistanceMatrix> {
    return new ResistanceMatrix(
      await ResistanceMatrix.buildMatrix(pokemonSets)
    );
  }

  private static async buildMatrix(
    pokemonSets: PartialPokemonSet[]
  ): Promise<ResistanceMatrixProps[]> {
    const types = await PokeInfo.types();
    const infos = await Promise.all(
      pokemonSets.map(pokemon => PokeInfo.forPokemonSet(pokemon))
    );

    return infos.flatMap(info => {
      const species = info.species;
      const resistances = info.resistances;

      return types.map(type => {
        const resistance = resistances[type] ?? 1.0;

        return {
          species,
          type,
          resistance,
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
        map((val: ResistanceMatrixProps) => val.resistance),
        scoringFunction
      )(values);

      return [type as TypeName, score];
    });
  }
}
