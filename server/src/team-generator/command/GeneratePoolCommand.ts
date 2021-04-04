import {ArraySchema} from '@colyseus/schema';
import {GenerationNum, Generations, Specie} from '@pkmn/data';
import {Dex} from '@pkmn/dex';
import {sampleSize} from 'lodash/fp';

import {Player} from '../Player';
import {Pokemon} from '../Pokemon';

import {StartPoolSelectionTimerCommand} from './StartPoolSelectionTimerCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

const generations = new Generations(Dex);
const isMythical = (pokemon: Pokemon) => MYTHICALS.includes(pokemon.id);
const isLegendary = (pokemon: Pokemon) =>
  LEGENDS.includes(pokemon.id) || SUB_LEGENDS.includes(pokemon.id);

export class GeneratePoolCommand extends TeamGeneratorCommand {
  execute(): TeamGeneratorCommand[] {
    this.logger.info('Generating player pools.');

    const nextPool = this.state.currentPool + 1;

    this.state.players.forEach(player => {
      if (player.pool) {
        player.previousPools.push(...player.pool);
      }

      player.pool = this.generatePool(player);
    });

    this.state.currentPool = nextPool;

    this.logger.info({nextPool}, 'Player pools generated.');

    return [new StartPoolSelectionTimerCommand()];
  }

  generatePool({team, previousPools}: Player): ArraySchema<Pokemon> {
    const {
      poolSize,
      legendaries,
      mythicals,
      exclusivePools,
      gen,
    } = this.state.options;

    const pokemon = this.allPokemon(gen);
    const teamMythicals = team.filter(isMythical).length;
    const teamLegendaries = team.filter(isLegendary).length;

    const teamFilter = (pokemon: Pokemon) => !team.includes(pokemon);
    const exclusiveFilter = (pokemon: Pokemon) =>
      !exclusivePools || !previousPools.includes(pokemon);
    let specieFilter;

    if (teamMythicals < mythicals) {
      specieFilter = isMythical;
    } else if (teamLegendaries < legendaries) {
      specieFilter = isLegendary;
    } else {
      specieFilter = (pokemon: Pokemon) =>
        !isMythical(pokemon) && !isLegendary(pokemon);
    }

    const availableSpecies = pokemon
      .filter(teamFilter)
      .filter(exclusiveFilter)
      .filter(specieFilter);
    const pool = sampleSize(poolSize, availableSpecies);

    return new ArraySchema<Pokemon>(...pool);
  }

  allPokemon(gen: GenerationNum): Pokemon[] {
    const generation = generations.get(gen);

    return Array.from(generation.species)
      .filter((specie: Specie) => specie.name === specie.baseSpecies)
      .map(this.createPokemon);
  }

  createPokemon(specie: Specie): Pokemon {
    return new Pokemon(specie.id, specie.name);
  }
}

const MYTHICALS = [
  'mew',
  'celebi',
  'jirachi',
  'deoxys',
  'phione',
  'manaphy',
  'darkrai',
  'shaymin',
  'arceus',
  'victini',
  'keldeo',
  'meloetta',
  'genesect',
  'diancie',
  'hoopa',
  'volcanion',
  'magearna',
  'marshadow',
  'zeraora',
  'meltan',
  'melmetal',
  'zarude',
];

const LEGENDS = [
  'mewtwo',
  'lugia',
  'hooh',
  'kyogre',
  'groudon',
  'rayquaza',
  'dialga',
  'palkia',
  'giratina',
  'reshiram',
  'zekrom',
  'kyurem',
  'xerneas',
  'yveltal',
  'zygarde',
  'cosmog',
  'cosmoem',
  'solgaleo',
  'lunala',
  'necrozma',
  'zacian',
  'zamazenta',
  'eternatus',
  'calyrex',
];

const SUB_LEGENDS = [
  'articuno',
  'zapdos',
  'moltres',
  'raikou',
  'entei',
  'suicune',
  'regirock',
  'regice',
  'registeel',
  'latias',
  'latios',
  'uxie',
  'mesprit',
  'azelf',
  'heatran',
  'regigigas',
  'cresselia',
  'cobalion',
  'terrakion',
  'virizion',
  'tornadus',
  'thundurus',
  'landorus',
  'typenull',
  'silvally',
  'tapukoko',
  'tapulele',
  'tapubulu',
  'tapufini',
  'nihilego',
  'buzzwole',
  'pheromosa',
  'xurkitree',
  'celesteela',
  'kartana',
  'guzzlord',
  'poipole',
  'naganadel',
  'stakataka',
  'blacephalon',
  'kubfu',
  'urshifu',
  'regieleki',
  'regidrago',
  'glastrier',
  'spectrier',
];
