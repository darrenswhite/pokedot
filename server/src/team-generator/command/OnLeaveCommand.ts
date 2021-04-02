import {Client} from 'colyseus';

import {TeamGeneratorCommand} from './TeamGeneratorCommand';

export interface OnLeaveCommandPayload {
  client: Client;
  sessionId: string;
  consented: boolean;
}

export class OnLeaveCommand extends TeamGeneratorCommand<OnLeaveCommandPayload> {
  async execute(
    {client, sessionId, consented}: OnLeaveCommandPayload = this.payload
  ): Promise<void> {
    const player = this.state.players.get(sessionId);

    if (player) {
      this.logger.info(
        {sessionId, consented},
        'Client disconnected from room.'
      );

      player.connected = false;

      try {
        if (consented) {
          throw new Error('consented leave');
        }

        await this.room.allowReconnection(client, 30);

        player.connected = true;

        this.logger.info({sessionId}, 'Client reconnected to room.');
      } catch (e) {
        this.state.players.delete(sessionId);

        this.logger.info(
          {sessionId},
          'Client did not reconnect, removed from room.'
        );
      }
    }
  }
}
