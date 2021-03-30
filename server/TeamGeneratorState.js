const schema = require('@colyseus/schema');

class Options extends schema.Schema {}

schema.defineTypes(Options, {
  teamSize: 'number',
  poolSize: 'number',
  legendaries: 'number',
  mythicals: 'number',
  exclusivePools: 'boolean',
  gen: 'number',
});

class Pokemon extends schema.Schema {}

schema.defineTypes(Pokemon, {
  species: 'string',
});

class Player extends schema.Schema {}

schema.defineTypes(Player, {
  id: 'string',
  name: 'string',
  team: [Pokemon],
  ready: 'boolean',
  connected: 'boolean',
});

class TeamGeneratorState extends schema.Schema {
  constructor(options) {
    super();
    this.options = options;
    this.players = new schema.MapSchema();
  }
}

schema.defineTypes(TeamGeneratorState, {
  options: Options,
  players: {map: Player},
});

module.exports = {TeamGeneratorState, Options, Player, Pokemon};
