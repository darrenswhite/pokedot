import {PartialPokemonSet} from '../info/PokeInfo';
import {TypeChartMatrix} from './TypeChartMatrix';

export class ResistanceMatrix extends TypeChartMatrix {
  static async forPokemonSets(
    pokemonSets: PartialPokemonSet[]
  ): Promise<ResistanceMatrix> {
    return new ResistanceMatrix(
      await ResistanceMatrix.buildMatrix(pokemonSets, info => info.resistances)
    );
  }
}
