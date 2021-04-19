import {DefaultMessagePayload} from './OnMessageCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

export interface SetPlayerNameCommandPayload extends DefaultMessagePayload {
  name: string;
}

export class SetPlayerNameCommand extends TeamGeneratorCommand<SetPlayerNameCommandPayload> {
  execute({sessionId, name} = this.payload): void {
    this.logger.info({sessionId, name}, 'Setting player name.');

    const player = this.state.players.get(sessionId);

    if (player && name.trim().length > 0) {
      player.name = name.trim().toUpperCase();
    }
  }
}
