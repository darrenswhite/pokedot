import {PoolGenerator} from '../../src/data/PoolGenerator';
import {Pool} from '../../src/team-generator/Pool';

describe('PoolGenerator', () => {
  describe('#eligiblePokemon()', () => {
    it('should create pool containing only Gen 8 Mythical Pokémon', () => {
      const poolGenerator = new PoolGenerator();
      const gen = 8;
      const pool = new Pool(false, false, false, false, true, 0, 0);

      const eligiblePokemon = poolGenerator.eligiblePokemon(gen, pool);
      const eligiblePokemonNames = eligiblePokemon.map(pokemon => pokemon.name);

      expect(eligiblePokemonNames).toStrictEqual([
        'Mew',
        'Celebi',
        'Jirachi',
        'Victini',
        'Keldeo',
        'Keldeo-Resolute',
        'Genesect',
        'Genesect-Douse',
        'Genesect-Shock',
        'Genesect-Burn',
        'Genesect-Chill',
        'Diancie',
        'Volcanion',
        'Magearna',
        'Marshadow',
        'Zeraora',
        'Meltan',
        'Melmetal',
        'Zarude',
      ]);
    });
    it('should create pool containing only Gen 7 Mythical Pokémon', () => {
      const poolGenerator = new PoolGenerator();
      const gen = 7;
      const pool = new Pool(false, false, false, false, true, 0, 0);

      const eligiblePokemon = poolGenerator.eligiblePokemon(gen, pool);
      const eligiblePokemonNames = eligiblePokemon.map(pokemon => pokemon.name);

      expect(eligiblePokemonNames).toStrictEqual([
        'Mew',
        'Celebi',
        'Jirachi',
        'Deoxys',
        'Deoxys-Attack',
        'Deoxys-Defense',
        'Deoxys-Speed',
        'Phione',
        'Manaphy',
        'Darkrai',
        'Shaymin',
        'Shaymin-Sky',
        'Arceus',
        'Arceus-Bug',
        'Arceus-Dark',
        'Arceus-Dragon',
        'Arceus-Electric',
        'Arceus-Fairy',
        'Arceus-Fighting',
        'Arceus-Fire',
        'Arceus-Flying',
        'Arceus-Ghost',
        'Arceus-Grass',
        'Arceus-Ground',
        'Arceus-Ice',
        'Arceus-Poison',
        'Arceus-Psychic',
        'Arceus-Rock',
        'Arceus-Steel',
        'Arceus-Water',
        'Victini',
        'Keldeo',
        'Keldeo-Resolute',
        'Meloetta',
        'Genesect',
        'Genesect-Douse',
        'Genesect-Shock',
        'Genesect-Burn',
        'Genesect-Chill',
        'Diancie',
        'Hoopa',
        'Hoopa-Unbound',
        'Volcanion',
        'Magearna',
        'Marshadow',
        'Zeraora',
      ]);
    });
    it('should create pool containing only Gen 8 Restricted Legendary Pokémon', () => {
      const poolGenerator = new PoolGenerator();
      const gen = 8;
      const pool = new Pool(false, false, true, false, false, 0, 0);

      const eligiblePokemon = poolGenerator.eligiblePokemon(gen, pool);
      const eligiblePokemonNames = eligiblePokemon.map(pokemon => pokemon.name);

      expect(eligiblePokemonNames).toStrictEqual([
        'Mewtwo',
        'Lugia',
        'Ho-Oh',
        'Kyogre',
        'Groudon',
        'Rayquaza',
        'Dialga',
        'Palkia',
        'Giratina',
        'Giratina-Origin',
        'Reshiram',
        'Zekrom',
        'Kyurem',
        'Kyurem-Black',
        'Kyurem-White',
        'Xerneas',
        'Yveltal',
        'Zygarde',
        'Zygarde-10%',
        'Cosmog',
        'Cosmoem',
        'Solgaleo',
        'Lunala',
        'Necrozma',
        'Necrozma-Dusk-Mane',
        'Necrozma-Dawn-Wings',
        'Zacian',
        'Zacian-Crowned',
        'Zamazenta',
        'Zamazenta-Crowned',
        'Eternatus',
        'Calyrex',
        'Calyrex-Ice',
        'Calyrex-Shadow',
      ]);
    });
    it('should create pool containing only Gen 8 Sub-Legendary Pokémon', () => {
      const poolGenerator = new PoolGenerator();
      const gen = 8;
      const pool = new Pool(false, false, false, true, false, 0, 0);

      const eligiblePokemon = poolGenerator.eligiblePokemon(gen, pool);
      const eligiblePokemonNames = eligiblePokemon.map(pokemon => pokemon.name);

      expect(eligiblePokemonNames).toStrictEqual([
        'Articuno',
        'Articuno-Galar',
        'Zapdos',
        'Zapdos-Galar',
        'Moltres',
        'Moltres-Galar',
        'Raikou',
        'Entei',
        'Suicune',
        'Regirock',
        'Regice',
        'Registeel',
        'Latias',
        'Latios',
        'Uxie',
        'Mesprit',
        'Azelf',
        'Heatran',
        'Regigigas',
        'Cresselia',
        'Cobalion',
        'Terrakion',
        'Virizion',
        'Tornadus',
        'Tornadus-Therian',
        'Thundurus',
        'Thundurus-Therian',
        'Landorus',
        'Landorus-Therian',
        'Type: Null',
        'Silvally',
        'Silvally-Bug',
        'Silvally-Dark',
        'Silvally-Dragon',
        'Silvally-Electric',
        'Silvally-Fairy',
        'Silvally-Fighting',
        'Silvally-Fire',
        'Silvally-Flying',
        'Silvally-Ghost',
        'Silvally-Grass',
        'Silvally-Ground',
        'Silvally-Ice',
        'Silvally-Poison',
        'Silvally-Psychic',
        'Silvally-Rock',
        'Silvally-Steel',
        'Silvally-Water',
        'Tapu Koko',
        'Tapu Lele',
        'Tapu Bulu',
        'Tapu Fini',
        'Nihilego',
        'Buzzwole',
        'Pheromosa',
        'Xurkitree',
        'Celesteela',
        'Kartana',
        'Guzzlord',
        'Poipole',
        'Naganadel',
        'Stakataka',
        'Blacephalon',
        'Kubfu',
        'Urshifu',
        'Urshifu-Rapid-Strike',
        'Regieleki',
        'Regidrago',
        'Glastrier',
        'Spectrier',
      ]);
    });
  });
});
