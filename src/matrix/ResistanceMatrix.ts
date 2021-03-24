import {TypeName} from '@pkmn/dex-types';
import {PartialPokemonSet, PokeInfo} from '../info/PokeInfo';
import {flow, map} from 'lodash/fp';
import {Matrix} from './Matrix';

export interface ResistanceMatrixProps {
  species: string;
  type: TypeName;
  resistance: number;
}

export class ResistanceMatrix extends Matrix<ResistanceMatrixProps> {
  constructor(pokemonSets: PartialPokemonSet[]) {
    super(ResistanceMatrix.buildMatrix(pokemonSets));
  }

  private static buildMatrix(
    pokemonSets: PartialPokemonSet[]
  ): ResistanceMatrixProps[] {
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
