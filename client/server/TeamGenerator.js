const {Room} = require('colyseus');
const {
  TeamGeneratorState,
  Options,
  Player,
  Pokemon,
} = require('./TeamGeneratorState');

class TeamGenerator extends Room {
  onCreate(options) {
    this.setState(new TeamGeneratorState(new Options(options)));

    this.onMessage('player-set-name', (client, name) => {
      this.state.players[client.sessionId].name = name;
    });

    this.onMessage('player-set-ready', (client, ready) => {
      this.state.players[client.sessionId].ready = ready;
    });

    this.onMessage('player-team-add', (client, pokemon) => {
      this.state.players[client.sessionId].team.push(
        new Pokemon(pokemon.species)
      );
    });
  }

  onJoin(client) {
    this.state.players[client.sessionId] = new Player({
      id: client.sessionId,
      name: 'Anonymous',
      team: [],
      ready: false,
      connected: true,
    });
  }

  async onLeave(client, consented) {
    this.state.players[client.sessionId].connected = false;

    try {
      if (consented) {
        throw new Error('consented leave');
      }

      await this.allowReconnection(client, 30);

      this.state.players[client.sessionId].connected = true;
    } catch (e) {
      delete this.state.players[client.sessionId];
    }
  }
}

module.exports = {TeamGenerator};
