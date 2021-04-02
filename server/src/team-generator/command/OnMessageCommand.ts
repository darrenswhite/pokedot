import {MessageCommandFactory, MessageType} from './MessageCommandFactory';
import {
  TeamGeneratorCommand,
  TeamGeneratorCommandPayload,
} from './TeamGeneratorCommand';

export interface OnMessageCommandPayload<
  P extends TeamGeneratorCommandPayload = TeamGeneratorCommandPayload
> {
  sessionId: string;
  type: string | number;
  payload: P;
}

export class OnMessageCommand extends TeamGeneratorCommand<OnMessageCommandPayload> {
  execute(
    {sessionId, type, payload}: OnMessageCommandPayload = this.payload
  ): TeamGeneratorCommand[] {
    const nextCommands = [];

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
