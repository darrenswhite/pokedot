import {GenerationNum, Generations, Specie} from '@pkmn/data';
import {Dex} from '@pkmn/dex';

import {Pokemon} from '../team-generator/Pokemon';
import {Pool} from '../team-generator/Pool';

const generations = new Generations(Dex);

const isMythical = (specie: Specie): boolean =>
  MYTHICALS.includes(specie.baseSpecies);

const isRestrictedLegendary = (specie: Specie): boolean =>
  RESTRICTED_LEGENDS.includes(specie.baseSpecies);

const isSubLegendary = (specie: Specie): boolean =>
  SUB_LEGENDS.includes(specie.baseSpecies);

const isFullyEvolved = (specie: Specie): boolean => !specie.nfe;

const hasBaseStatTotal = (predicate: (total: number) => boolean) => (
  specie: Specie
): boolean => {
  const total = Object.values(specie.baseStats).reduce(
    (left, right) => left + right,
    0
  );

  return predicate(total);
};

const isBattleForm = (specie: Specie): boolean => !!specie.battleOnly;

const isDisabled = (specie: Specie): boolean =>
  DISABLED_SPECIES.includes(specie.name);

const not = (filter: (specie: Specie) => boolean) => (specie: Specie) =>
  !filter(specie);

const every = (filters: ((specie: Specie) => boolean)[]) => (specie: Specie) =>
  filters.every(filter => filter(specie));

export class PoolGenerator {
  eligiblePokemon(gen: GenerationNum, pool: Pool): Pokemon[] {
    const species = this.species(gen);

    return this.eligibleSpecies(species, pool).map(
      this.createPokemon.bind(this)
    );
  }

  eligibleSpecies(species: Specie[], pool: Pool): Specie[] {
    let eligibleSpecies = [];

    if (pool.mythicals) {
      eligibleSpecies.push(...species.filter(isMythical));
    }

    if (pool.restrictedLegendaries) {
      eligibleSpecies.push(...species.filter(isRestrictedLegendary));
    }

    if (pool.subLegendaries) {
      eligibleSpecies.push(...species.filter(isSubLegendary));
    }

    if (pool.fullyEvolved) {
      eligibleSpecies.push(
        ...species.filter(
          every([
            isFullyEvolved,
            not(isMythical),
            not(isRestrictedLegendary),
            not(isSubLegendary),
          ])
        )
      );
    }

    if (pool.notFullyEvolved) {
      eligibleSpecies.push(
        ...species.filter(
          every([
            not(isFullyEvolved),
            not(isMythical),
            not(isRestrictedLegendary),
            not(isSubLegendary),
          ])
        )
      );
    }

    if (pool.minimumBaseStatTotal) {
      eligibleSpecies = eligibleSpecies.filter(
        hasBaseStatTotal(total => total >= pool.minimumBaseStatTotal)
      );
    }

    if (pool.maximumBaseStatTotal) {
      eligibleSpecies = eligibleSpecies.filter(
        hasBaseStatTotal(total => total <= pool.maximumBaseStatTotal)
      );
    }

    eligibleSpecies = eligibleSpecies.filter(not(isBattleForm));
    eligibleSpecies = eligibleSpecies.filter(not(isDisabled));

    return eligibleSpecies;
  }

  species(gen: GenerationNum): Specie[] {
    const generation = generations.get(gen);

    return Array.from(generation.species);
  }

  createPokemon(specie: Specie): Pokemon {
    return new Pokemon(specie.num, specie.name);
  }
}

const MYTHICALS = [
  'Mew',
  'Celebi',
  'Jirachi',
  'Deoxys',
  'Phione',
  'Manaphy',
  'Darkrai',
  'Shaymin',
  'Arceus',
  'Victini',
  'Keldeo',
  'Meloetta',
  'Genesect',
  'Diancie',
  'Hoopa',
  'Volcanion',
  'Magearna',
  'Marshadow',
  'Zeraora',
  'Meltan',
  'Melmetal',
  'Zarude',
];

const RESTRICTED_LEGENDS = [
  'Mewtwo',
  'Lugia',
  'Ho-Oh',
  'Kyogre',
  'Groudon',
  'Rayquaza',
  'Dialga',
  'Palkia',
  'Giratina',
  'Reshiram',
  'Zekrom',
  'Kyurem',
  'Xerneas',
  'Yveltal',
  'Zygarde',
  'Cosmog',
  'Cosmoem',
  'Solgaleo',
  'Lunala',
  'Necrozma',
  'Zacian',
  'Zamazenta',
  'Eternatus',
  'Calyrex',
];

const SUB_LEGENDS = [
  'Articuno',
  'Zapdos',
  'Moltres',
  'Raikou',
  'Entei',
  'Suicune',
  'Regirock',
  'Regice',
  'Registeel',
  'Latias',
  'Latios',
  'Uxie',
  'Mesprit',
  'Azelf',
  'Heatran',
  'Regigigas',
  'Cresselia',
  'Cobalion',
  'Terrakion',
  'Virizion',
  'Tornadus',
  'Thundurus',
  'Landorus',
  'Type: Null',
  'Silvally',
  'Tapu Koko',
  'Tapu Lele',
  'Tapu Bulu',
  'Tapu Fini',
  'Nihilego',
  'Buzzwole',
  'Pheromosa',
  'Xurkitree',
  'Celesteela',
  'Kartana',
  'Guzzlord',
  'Poipole',
  'Naganadel',
  'Stakataka',
  'Blacephalon',
  'Kubfu',
  'Urshifu',
  'Regieleki',
  'Regidrago',
  'Glastrier',
  'Spectrier',
];

const DISABLED_SPECIES = [
  'Pikachu-Original',
  'Pikachu-Hoenn',
  'Pikachu-Sinnoh',
  'Pikachu-Unova',
  'Pikachu-Kalos',
  'Pikachu-Alola',
  'Pikachu-Partner',
  'Pikachu-World',
  'Magearna-Original',
  'Sinistea-Antique',
  'Polteageist-Antique',
  'Zarude-Dada',
];
