import {ArraySchema} from '@colyseus/schema';
import {GenerationNum, Generations, Specie} from '@pkmn/data';
import {Dex} from '@pkmn/dex';
import {sampleSize} from 'lodash/fp';

import {Player} from '../Player';
import {Pokemon} from '../Pokemon';

import {StartPoolSelectionTimerCommand} from './StartPoolSelectionTimerCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

const generations = new Generations(Dex);
const isMythical = (pokemon: Pokemon) =>
  MYTHICALS.includes(pokemon.baseSpecies);
const isLegendary = (pokemon: Pokemon) =>
  LEGENDS.includes(pokemon.baseSpecies) ||
  SUB_LEGENDS.includes(pokemon.baseSpecies);

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

    const teamFilter = (pokemon: Pokemon) =>
      team.filter(p => p.num === pokemon.num).length === 0;
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

    return Array.from(generation.species).map(this.createPokemon);
  }

  createPokemon(specie: Specie): Pokemon {
    return new Pokemon(specie.num, specie.name, specie.baseSpecies);
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

const LEGENDS = [
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
