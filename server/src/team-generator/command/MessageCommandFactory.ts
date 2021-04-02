import {PlayerSetNameCommand} from './PlayerSetNameCommand';
import {PlayerSetReadyCommand} from './PlayerSetReadyCommand';
import {
  TeamGeneratorCommand,
  TeamGeneratorCommandPayload,
} from './TeamGeneratorCommand';

export enum MessageType {
  PlayerSetName = 'PlayerSetName',
  PlayerSetReady = 'PlayerSetReady',
}

const messageCommands = {
  [MessageType.PlayerSetName]: PlayerSetNameCommand,
  [MessageType.PlayerSetReady]: PlayerSetReadyCommand,
};

export class MessageCommandFactory {
  static getMessageCommand<
    P extends TeamGeneratorCommandPayload = TeamGeneratorCommandPayload
  >(type: MessageType, payload: unknown): TeamGeneratorCommand<P> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new messageCommands[type](payload as any) as TeamGeneratorCommand<P>;
  }
}
