import {ArraySchema} from '@colyseus/schema';
import {GenerationNum, Generations, Specie} from '@pkmn/data';
import {Dex} from '@pkmn/dex';
import {filter, sampleSize} from 'lodash/fp';

import {Player} from '../Player';
import {Pokemon} from '../Pokemon';
import {Pool} from '../Pool';

import {StartPoolSelectionTimerCommand} from './StartPoolSelectionTimerCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

const generations = new Generations(Dex);

const isMythical = (specie: Specie) => MYTHICALS.includes(specie.baseSpecies);

const isRestrictedLegendary = (specie: Specie) =>
  RESTRICTED_LEGENDS.includes(specie.baseSpecies);

const isSubLegendary = (specie: Specie) =>
  SUB_LEGENDS.includes(specie.baseSpecies);

const isFullyEvolved = (specie: Specie) => !specie.nfe;

const not = (filter: (specie: Specie) => boolean) => (specie: Specie) =>
  !filter(specie);

const every = (filters: ((specie: Specie) => boolean)[]) => (specie: Specie) =>
  filters.every(filter => filter(specie));

export class GeneratePoolCommand extends TeamGeneratorCommand {
  execute(): TeamGeneratorCommand[] {
    const pools = this.state.options.pools;
    const currentPool = this.state.currentPool + 1;
    const pool = pools[currentPool];

    this.logger.info({currentPool, pool}, 'Generating player pools...');

    if (pool) {
      this.state.players.forEach(player => {
        const playerPool = this.generatePool(pool, player);

        player.pool = playerPool;
        player.previousPools.push(...playerPool);
      });

      this.state.currentPool = currentPool;

      this.logger.info({currentPool, pool}, 'Player pools generated.');
    } else {
      this.logger.error(
        {currentPool},
        'Failed to generate player pools: current pool does not exist.'
      );
    }

    return [new StartPoolSelectionTimerCommand()];
  }

  generatePool(
    pool: Pool,
    {team, previousPools}: Player
  ): ArraySchema<Pokemon> {
    const {poolSize, exclusivePools, gen} = this.state.options;
    const teamFilter = (pokemon: Pokemon) =>
      filter((member: Pokemon) => member.num === pokemon.num)(team).length ===
      0;
    const exclusiveFilter = (pokemon: Pokemon) =>
      !exclusivePools ||
      filter((member: Pokemon) => member.name === pokemon.name)(previousPools)
        .length === 0;

    const species = this.species(gen);
    const eligiblePokemon = this.eligibleSpecies(species, pool).map(
      this.createPokemon.bind(this)
    );

    const pokemonPool = eligiblePokemon
      .filter(teamFilter)
      .filter(exclusiveFilter);
    const poolSample = sampleSize(poolSize, pokemonPool);

    return new ArraySchema<Pokemon>(...poolSample);
  }

  eligibleSpecies(species: Specie[], pool: Pool): Specie[] {
    const eligibleSpecies = [];

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
