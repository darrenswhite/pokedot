import {PokemonSet} from '@pkmn/data';

type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

export type PartialPokemonSet = PartialExcept<PokemonSet, 'species'>;
