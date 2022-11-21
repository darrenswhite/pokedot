import {Timer} from '../../util/Timer.js';

import {GeneratePoolCommand} from './GeneratePoolCommand.js';
import {TeamGeneratorCommand} from './TeamGeneratorCommand.js';

export class StartPoolSelectionTimerCommand extends TeamGeneratorCommand {
  async execute(): Promise<TeamGeneratorCommand[]> {
    const nextCommands = [];
    const {currentPool, options, players} = this.state;
    const {poolSelectionTime} = this.state.options;

    this.logger.info(
      {currentPool, poolSelectionTime},
      'Starting pool selection timer.'
    );

    this.state.currentPoolTime = poolSelectionTime;

    const timer = new Timer(poolSelectionTime, 1000, currentMs => {
      this.state.currentPoolTime = poolSelectionTime - currentMs;
    });

    await timer.run();

    players.forEach(player => {
      if (player.team.length === currentPool && player.pool.length > 0) {
        player.team.setAt(
          currentPool,
          player.pool.at(this.random(0, player.pool.length - 1))
        );
      }
    });

    if (currentPool < options.pools.length - 1) {
      nextCommands.push(new GeneratePoolCommand());
    } else {
      this.state.currentPool = currentPool + 1;
    }

    this.logger.info({poolSelectionTime}, 'Pool selection timer completed.');

    return nextCommands;
  }

  random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
