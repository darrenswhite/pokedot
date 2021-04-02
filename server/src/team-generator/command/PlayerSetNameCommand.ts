import {
  TeamGeneratorCommand,
  TeamGeneratorCommandPayload,
} from './TeamGeneratorCommand';

export interface PlayerSetNameCommandPayload
  extends TeamGeneratorCommandPayload {
  name: string;
}

export class PlayerSetNameCommand extends TeamGeneratorCommand<PlayerSetNameCommandPayload> {
  execute({sessionId, name} = this.payload): void {
    this.logger.info({sessionId, name}, 'Setting player name.');

    const player = this.state.players.get(sessionId);

    if (player) {
      player.name = name;
    }
  }
}
