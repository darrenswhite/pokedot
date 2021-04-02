import {Player} from '../Player';

import {TeamGeneratorCommand} from './TeamGeneratorCommand';

export interface OnJoinCommandPayload {
  sessionId: string;
}

export class OnJoinCommand extends TeamGeneratorCommand<OnJoinCommandPayload> {
  execute({sessionId}: OnJoinCommandPayload = this.payload): void {
    this.logger.info({sessionId}, 'Client joined room.');

    const player = new Player(sessionId, 'Anonymous');

    this.state.players.set(sessionId, player);
  }
}
