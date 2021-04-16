import {Generation, TypeName} from '@pkmn/data';

import {PartialPokemonSet} from '../PartialPokemonSet';

import {TypeChart, TypeChartMatrix} from './TypeChartMatrix';

export class ResistanceMatrix extends TypeChartMatrix {
  static forPokemonSets(
    generation: Generation,
    pokemonSets: PartialPokemonSet[]
  ): ResistanceMatrix {
    return new ResistanceMatrix(
      ResistanceMatrix.buildMatrix(
        generation,
        pokemonSets,
        ResistanceMatrix.createResistanceTypeChart.bind(this)
      )
    );
  }

  private static createResistanceTypeChart(
    generation: Generation,
    pokemon: PartialPokemonSet
  ): TypeChart {
    const types: TypeName[] =
      generation.species.get(pokemon.species)?.types ?? [];

    return Object.fromEntries(
      Array.from(generation.types).map(type => {
        const values: number[] = types.map(targetType =>
          type.totalEffectiveness(targetType)
        );
        const total = values.reduce((prev, curr) => prev * curr, 1);

        return [type, total];
      })
    ) as TypeChart;
  }
}
