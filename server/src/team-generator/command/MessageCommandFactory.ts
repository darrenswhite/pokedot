import {DefaultMessagePayload} from './OnMessageCommand';
import {SetPlayerNameCommand} from './SetPlayerNameCommand';
import {SetPlayerPoolSelectionCommand} from './SetPlayerPoolSelectionCommand';
import {SetPlayerReadyCommand} from './SetPlayerReadyCommand';
import {TeamGeneratorCommand} from './TeamGeneratorCommand';

export enum MessageType {
  SET_PLAYER_NAME = 'SET_PLAYER_NAME',
  SET_PLAYER_READY = 'SET_PLAYER_READY',
  SET_PLAYER_POOL_SELECTION = 'SET_PLAYER_POOL_SELECTION',
}

const messageCommands = {
  [MessageType.SET_PLAYER_NAME]: SetPlayerNameCommand,
  [MessageType.SET_PLAYER_READY]: SetPlayerReadyCommand,
  [MessageType.SET_PLAYER_POOL_SELECTION]: SetPlayerPoolSelectionCommand,
};

export class MessageCommandFactory {
  static getMessageCommand(
    type: MessageType,
    payload: DefaultMessagePayload
  ): TeamGeneratorCommand {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    return new messageCommands[type](payload as any);
  }
}
