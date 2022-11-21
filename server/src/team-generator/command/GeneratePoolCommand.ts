import {ArraySchema} from '@colyseus/schema';
import {Inject} from 'typescript-ioc';

import {PoolGenerator} from '../../data/PoolGenerator.js';
import {Player} from '../Player.js';
import {Pokemon} from '../Pokemon.js';
import {Pool} from '../Pool.js';

import {StartPoolSelectionTimerCommand} from './StartPoolSelectionTimerCommand.js';
import {TeamGeneratorCommand} from './TeamGeneratorCommand.js';

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
      Array.from(team.values()).filter(
        (member: Pokemon) => member.num === pokemon.num
      ).length === 0;
    const exclusiveFilter = (pokemon: Pokemon) =>
      !exclusivePools ||
      Array.from(previousPools.values()).filter(
        (member: Pokemon) => member.name === pokemon.name
      ).length === 0;

    const eligiblePokemon = this.generator.eligiblePokemon(gen, pool);

    const pokemonPool = eligiblePokemon
      .filter(teamFilter)
      .filter(exclusiveFilter);
    const poolSample = this.sampleSize(pokemonPool, poolSize);

    return new ArraySchema<Pokemon>(...poolSample);
  }

  sampleSize<T>(arr: T[], n: number): T[] {
    const shuffled = Array.from(arr).sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }
}
