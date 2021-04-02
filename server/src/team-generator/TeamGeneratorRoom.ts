import {Dispatcher} from '@colyseus/command';
import {Client, Room} from 'colyseus';

import {IdGenerator} from '../util/IdGenerator';
import {Logger} from '../util/Logger';

import {OnJoinCommand} from './command/OnJoinCommand';
import {OnLeaveCommand} from './command/OnLeaveCommand';
import {OnMessageCommand} from './command/OnMessageCommand';
import {OptionsProps} from './Options';
import {Pokemon} from './Pokemon';
import {TeamGeneratorState} from './TeamGeneratorState';

export class TeamGeneratorRoom extends Room<TeamGeneratorState> {
  logger = Logger.child({});
  dispatcher: Dispatcher = new Dispatcher(this);

  onCreate(options: OptionsProps): void {
    // TODO check id is unique
    this.roomId = IdGenerator.generateAlphanumeric();

    this.logger = Logger.child({
      roomId: this.roomId,
    });

    this.logger.info('Creating new room...');

    this.setState(new TeamGeneratorState(options));

    this.onMessage('*', ({sessionId}, type, payload) => {
      this.logger.info(
        {sessionId, type},
        'Delegating client message to dispatcher.'
      );

      this.dispatcher.dispatch(
        new OnMessageCommand({
          sessionId,
          type,
          payload: {sessionId, ...payload},
        })
      );
    });

    this.onMessage('player-team-add', (client, pokemon) => {
      const player = this.state.players.get(client.sessionId);

      if (player) {
        player.team.push(new Pokemon(pokemon.species));
      }
    });

    this.logger.info('Successfully created new room.');
  }

  onJoin({sessionId}: Client): void {
    this.logger.info({sessionId}, 'Delegating client join to dispatcher.');

    this.dispatcher.dispatch(
      new OnJoinCommand({
        sessionId,
      })
    );
  }

  onLeave(client: Client, consented: boolean): void {
    const sessionId = client.sessionId;

    this.logger.info({sessionId}, 'Delegating client leave to dispatcher.');

    this.dispatcher.dispatch(
      new OnLeaveCommand({
        client,
        sessionId,
        consented,
      })
    );
  }
}
