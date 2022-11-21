import {DefaultMessagePayload} from './OnMessageCommand.js';
import {SetPlayerNameCommand} from './SetPlayerNameCommand.js';
import {SetPlayerPoolSelectionCommand} from './SetPlayerPoolSelectionCommand.js';
import {SetPlayerReadyCommand} from './SetPlayerReadyCommand.js';
import {TeamGeneratorCommand} from './TeamGeneratorCommand.js';

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
  static getMessageCommand<
    P extends DefaultMessagePayload,
    C extends TeamGeneratorCommand<P>
  >(type: MessageType, payload: P): TeamGeneratorCommand {
    const command = messageCommands[type] as unknown as new (payload: P) => C;

    return new command(payload);
  }
}
