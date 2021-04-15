import {every} from 'lodash/fp';

import {GeneratePoolCommand} from './GeneratePoolCommand';
import {ResetPoolsCommand} from './ResetPoolsCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

export class StartGeneratorCommand extends TeamGeneratorCommand {
  validate(): boolean {
    return (
      every(player => player.ready, Array.from(this.state.players.values())) &&
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
      .catch(err => {
        this.logger.error({err}, 'Failed to lock room.');
        // TODO what do we do in this scenario?
        return [];
      });
  }
}
