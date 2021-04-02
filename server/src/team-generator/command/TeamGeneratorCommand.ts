import {Command} from '@colyseus/command';
import {Logger as PinoLogger} from 'pino';

import {Logger} from '../../util/Logger';
import {TeamGeneratorState} from '../TeamGeneratorState';

export interface TeamGeneratorCommandPayload {
  sessionId: string;
}

export abstract class TeamGeneratorCommand<
  P extends TeamGeneratorCommandPayload = TeamGeneratorCommandPayload
> extends Command<TeamGeneratorState, P> {
  private _logger?: PinoLogger;

  constructor(payload?: P) {
    super();
    if (payload) {
      this.payload = payload;
    }
  }

  get logger(): PinoLogger {
    if (!this._logger) {
      // Room does not exist at point of instantiation
      // so we need to create a new logger when its requested
      this._logger = Logger.child({
        roomId: this.room.roomId,
      });
    }

    return this._logger;
  }
}
