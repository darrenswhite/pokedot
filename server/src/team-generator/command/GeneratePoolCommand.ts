import {ArraySchema} from '@colyseus/schema';
import {Generations, Specie} from '@pkmn/data';
import {Dex} from '@pkmn/dex';
import {sampleSize} from 'lodash/fp';

import {Player} from '../Player';
import {Pokemon} from '../Pokemon';

import {StartPoolSelectionTimerCommand} from './StartPoolSelectionTimerCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

const generations = new Generations(Dex);
const isMythical = (specie: Specie) => MYTHICALS.includes(specie.id);
const isLegendary = (specie: Specie) =>
  LEGENDS.includes(specie.id) || SUB_LEGENDS.includes(specie.id);

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

  generatePool(player: Player): ArraySchema<Pokemon> {
    const {
      poolSize,
      legendaries,
      mythicals,
      exclusivePools,
      gen,
    } = this.state.options;

    const generation = generations.get(gen);
    const species = Array.from(generation.species);
    const teamSpecies = player.team
      .map(pokemon => generation.species.get(pokemon.species))
      .filter(specie => !!specie) as Specie[];
    const previousPoolsSpecies = player.previousPools
      .map(pokemon => generation.species.get(pokemon.species))
      .filter(specie => !!specie) as Specie[];
    const teamMythicals = teamSpecies.filter(isMythical).length;
    const teamLegendaries = teamSpecies.filter(isLegendary).length;

    const exclusiveFilter = (specie: Specie) =>
      !exclusivePools || !previousPoolsSpecies.includes(specie);
    let specieFilter;

    if (teamMythicals < mythicals) {
      specieFilter = isMythical;
    } else if (teamLegendaries < legendaries) {
      specieFilter = isLegendary;
    } else {
      specieFilter = (specie: Specie) =>
        !isMythical(specie) && !isLegendary(specie);
    }

    const availableSpecies = species
      .filter(specie => !teamSpecies.includes(specie))
      .filter(exclusiveFilter)
      .filter(specieFilter);
    const speciesPool = sampleSize(poolSize, availableSpecies);
    const pool = speciesPool.map(this.createPokemon);

    return new ArraySchema<Pokemon>(...pool);
  }

  createPokemon(specie: Specie): Pokemon {
    return new Pokemon(specie.id);
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
