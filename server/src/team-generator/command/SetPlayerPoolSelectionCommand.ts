import {DefaultMessagePayload} from './OnMessageCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

export interface SetPlayerPoolSelectionCommandPayload
  extends DefaultMessagePayload {
  index: number;
}

export class SetPlayerPoolSelectionCommand extends TeamGeneratorCommand<SetPlayerPoolSelectionCommandPayload> {
  validate(): boolean {
    return this.state.currentPool !== -1;
  }

  execute({sessionId, index} = this.payload): void {
    const currentPool = this.state.currentPool;

    this.logger.info({sessionId, index}, 'Setting player pool selection.');

    const player = this.state.players.get(sessionId);

    if (player && index < player.pool.length) {
      player.team[currentPool] = player.pool[index];
    }
  }
}
