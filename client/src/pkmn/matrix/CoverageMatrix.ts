import {Generation, Move} from '@pkmn/data';

import {PartialPokemonSet} from '../PartialPokemonSet';

import {TypeChart, TypeChartMatrix} from './TypeChartMatrix';

export class CoverageMatrix extends TypeChartMatrix {
  static forPokemonSets(
    generation: Generation,
    pokemonSets: PartialPokemonSet[]
  ): CoverageMatrix {
    return new CoverageMatrix(
      CoverageMatrix.buildMatrix(
        generation,
        pokemonSets,
        CoverageMatrix.createCoverageTypeChart.bind(this)
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
    ) as TypeChart;
  }
}
