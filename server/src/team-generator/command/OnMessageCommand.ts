import {MessageCommandFactory, MessageType} from './MessageCommandFactory.js';
import {TeamGeneratorCommand} from './TeamGeneratorCommand.js';

export interface OnMessageCommandPayload {
  type: string | number;
  payload: DefaultMessagePayload;
}

export interface DefaultMessagePayload {
  sessionId: string;
  [key: string]: unknown;
}

export class OnMessageCommand extends TeamGeneratorCommand<OnMessageCommandPayload> {
  execute(
    {type, payload}: OnMessageCommandPayload = this.payload
  ): TeamGeneratorCommand[] {
    const nextCommands = [];
    const {sessionId} = payload;

    this.logger.info({sessionId, type}, 'Client message received.');

    if (type in MessageType) {
      nextCommands.push(
        MessageCommandFactory.getMessageCommand(type as MessageType, payload)
      );
    } else {
      this.logger.warn({sessionId, type}, 'Unknown message type received.');
    }

    return nextCommands;
  }
}
