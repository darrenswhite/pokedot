import {random} from 'lodash/fp';

import {Timer} from '../../util/Timer';

import {GeneratePoolCommand} from './GeneratePoolCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

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
      if (player.team.length === currentPool) {
        player.team.setAt(
          currentPool,
          player.pool.at(random(0, player.pool.length - 1))
        );
      }
    });

    if (currentPool < options.teamSize - 1) {
      nextCommands.push(new GeneratePoolCommand());
    } else {
      this.state.currentPool = currentPool + 1;
    }

    this.logger.info({poolSelectionTime}, 'Pool selection timer completed.');

    return nextCommands;
  }
}
