import {ArraySchema} from '@colyseus/schema';
import {random, times} from 'lodash/fp';

import {Pokemon} from '../Pokemon';

import {StartPoolSelectionTimerCommand} from './StartPoolSelectionTimerCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

export class GeneratePoolCommand extends TeamGeneratorCommand {
  execute(): TeamGeneratorCommand[] {
    this.logger.info('Generating player pools.');

    const nextPool = this.state.currentPool + 1;

    this.state.players.forEach(player => {
      player.pool = this.generatePool();
    });

    this.state.currentPool = nextPool;

    this.logger.info({nextPool}, 'Player pools generated.');

    return [new StartPoolSelectionTimerCommand()];
  }

  generatePool(): ArraySchema<Pokemon> {
    const {poolSize} = this.state.options;

    return new ArraySchema<Pokemon>(
      ...times(() => new Pokemon('' + random(0, 100)), poolSize)
    );
  }
}
