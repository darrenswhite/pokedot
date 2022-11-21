import {TeamGeneratorCommand} from './TeamGeneratorCommand.js';

export class ResetPoolsCommand extends TeamGeneratorCommand {
  execute(): void {
    this.logger.info('Resetting pool states.');

    this.state.currentPool = -1;
    this.state.players.forEach(player => {
      player.pool.clear();
      player.team.clear();
    });
  }
}
