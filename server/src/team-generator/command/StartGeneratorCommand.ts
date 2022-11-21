import {GeneratePoolCommand} from './GeneratePoolCommand.js';
import {ResetPoolsCommand} from './ResetPoolsCommand.js';
import {TeamGeneratorCommand} from './TeamGeneratorCommand.js';

export class StartGeneratorCommand extends TeamGeneratorCommand {
  validate(): boolean {
    const players = Array.from(this.state.players.values());

    return (
      players.filter(player => player.ready).length === players.length &&
      this.state.currentPool === -1
    );
  }

  async execute(): Promise<TeamGeneratorCommand[]> {
    this.logger.info('All players ready, locking room.');

    return this.room
      .lock()
      .then(() => {
        return [new ResetPoolsCommand(), new GeneratePoolCommand()];
      })
      .catch((err: unknown) => {
        this.logger.error({err}, 'Failed to lock room.');
        // TODO what do we do in this scenario?
        return [];
      });
  }
}
