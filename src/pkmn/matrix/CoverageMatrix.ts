import {PartialPokemonSet} from '../PokeInfo';
import {TypeChartMatrix} from './TypeChartMatrix';

export class CoverageMatrix extends TypeChartMatrix {
  static async forPokemonSets(
    pokemonSets: PartialPokemonSet[]
  ): Promise<CoverageMatrix> {
    return new CoverageMatrix(
      await CoverageMatrix.buildMatrix(pokemonSets, info => info.coverage)
    );
  }
}
