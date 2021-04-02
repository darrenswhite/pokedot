import {DefaultMessagePayload} from './OnMessageCommand';
import {StartGeneratorCommand} from './StartGeneratorCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

export class SetPlayerReadyCommand extends TeamGeneratorCommand<DefaultMessagePayload> {
  execute({sessionId} = this.payload): TeamGeneratorCommand[] {
    this.logger.info({sessionId}, 'Setting player ready.');

    const player = this.state.players.get(sessionId);

    if (player) {
      player.ready = true;
    }

    return [new StartGeneratorCommand()];
  }
}
