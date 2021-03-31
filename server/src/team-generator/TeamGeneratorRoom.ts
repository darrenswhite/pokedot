import {Dispatcher} from '@colyseus/command';
import {Client, Room} from 'colyseus';

import {Logger} from '../util/Logger';

import {OptionsProps} from './Options';
import {Player} from './Player';
import {Pokemon} from './Pokemon';
import {TeamGeneratorState} from './TeamGeneratorState';

export class TeamGeneratorRoom extends Room<TeamGeneratorState> {
  logger = Logger.child({
    roomId: this.roomId,
  });
  dispatcher: Dispatcher = new Dispatcher(this);

  onCreate(options: OptionsProps): void {
    this.logger.info('Creating new team generator room...');

    this.setState(new TeamGeneratorState(options));

    this.onMessage('player-set-name', (client, name) => {
      const player = this.state.players.get(client.sessionId);

      if (player) {
        player.name = name;
      }
    });

    this.onMessage('player-set-ready', (client, ready) => {
      const player = this.state.players.get(client.sessionId);

      if (player) {
        player.ready = ready;
      }
    });

    this.onMessage('player-team-add', (client, pokemon) => {
      const player = this.state.players.get(client.sessionId);

      if (player) {
        player.team.push(new Pokemon(pokemon.species));
      }
    });

    this.logger.info('Successfully created team generator room.');
  }

  onJoin(client: Client): void {
    this.state.players.set(
      client.sessionId,
      new Player({
        id: client.sessionId,
        name: 'Anonymous',
        team: [],
        ready: false,
        connected: true,
      })
    );
  }

  async onLeave(client: Client, consented: unknown): Promise<void> {
    const player = this.state.players.get(client.sessionId);

    if (player) {
      player.connected = false;

      try {
        if (consented) {
          throw new Error('consented leave');
        }

        await this.allowReconnection(client, 30);

        player.connected = true;
      } catch (e) {
        this.state.players.delete(client.sessionId);
      }
    }
  }
}
