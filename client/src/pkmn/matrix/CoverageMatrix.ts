import {Generation, Move} from '@pkmn/data';

import {PartialPokemonSet} from '../PartialPokemonSet';

import {TypeChart, TypeChartMatrix} from './TypeChartMatrix';

export class CoverageMatrix extends TypeChartMatrix {
  static async forPokemonSets(
    generation: Generation,
    pokemonSets: PartialPokemonSet[]
  ): Promise<CoverageMatrix> {
    return new CoverageMatrix(
      await CoverageMatrix.buildMatrix(
        generation,
        pokemonSets,
        CoverageMatrix.createCoverageTypeChart
      )
    );
  }

  private static createCoverageTypeChart(
    generation: Generation,
    pokemon: PartialPokemonSet
  ): TypeChart {
    const damageMoves = (pokemon.moves
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
}
