import {ArraySchema} from '@colyseus/schema';
import {filter, sampleSize} from 'lodash/fp';
import {Inject} from 'typescript-ioc';

import {PoolGenerator} from '../../data/PoolGenerator';
import {Player} from '../Player';
import {Pokemon} from '../Pokemon';
import {Pool} from '../Pool';

import {StartPoolSelectionTimerCommand} from './StartPoolSelectionTimerCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

export class GeneratePoolCommand extends TeamGeneratorCommand {
  @Inject
  generator!: PoolGenerator;

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

    const eligiblePokemon = this.generator.eligiblePokemon(gen, pool);

    const pokemonPool = eligiblePokemon
      .filter(teamFilter)
      .filter(exclusiveFilter);
    const poolSample = sampleSize(poolSize, pokemonPool);

    return new ArraySchema<Pokemon>(...poolSample);
  }
}
