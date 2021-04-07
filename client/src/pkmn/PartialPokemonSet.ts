import {PokemonSet} from '@pkmn/dex-types';

type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

export type PartialPokemonSet = PartialExcept<PokemonSet, 'species'>;
