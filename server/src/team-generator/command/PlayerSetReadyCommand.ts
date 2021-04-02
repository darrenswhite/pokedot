import {TeamGeneratorCommand} from './TeamGeneratorCommand';

export class PlayerSetReadyCommand extends TeamGeneratorCommand {
  execute({sessionId} = this.payload): void {
    this.logger.info({sessionId}, 'Setting player ready.');

    const player = this.state.players.get(sessionId);

    if (player) {
      player.ready = true;
    }
  }
}
