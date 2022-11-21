import {PoolGenerator} from '../../src/data/PoolGenerator';
import {Pool} from '../../src/team-generator/Pool';

describe('PoolGenerator', () => {
  describe('#eligiblePokemon()', () => {
    it('should create pool containing only Gen 8 Mythical Pokémon', () => {
      const poolGenerator = new PoolGenerator();
      const gen = 8;
      const pool = new Pool(false, false, false, false, true, 0, 0);

      const eligiblePokemon = poolGenerator.eligiblePokemon(gen, pool);
      const eligiblePokemonNames = eligiblePokemon
        .map(pokemon => pokemon.name)
        .sort();

      expect(eligiblePokemonNames).toStrictEqual([
        'Celebi',
        'Diancie',
        'Genesect',
        'Genesect-Burn',
        'Genesect-Chill',
        'Genesect-Douse',
        'Genesect-Shock',
        'Jirachi',
        'Keldeo',
        'Keldeo-Resolute',
        'Magearna',
        'Marshadow',
        'Melmetal',
        'Meltan',
        'Mew',
        'Victini',
        'Volcanion',
        'Zarude',
        'Zeraora',
      ]);
    });
    it('should create pool containing only Gen 7 Mythical Pokémon', () => {
      const poolGenerator = new PoolGenerator();
      const gen = 7;
      const pool = new Pool(false, false, false, false, true, 0, 0);

      const eligiblePokemon = poolGenerator.eligiblePokemon(gen, pool);
      const eligiblePokemonNames = eligiblePokemon
        .map(pokemon => pokemon.name)
        .sort();

      expect(eligiblePokemonNames).toStrictEqual([
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
        'Celebi',
        'Darkrai',
        'Deoxys',
        'Deoxys-Attack',
        'Deoxys-Defense',
        'Deoxys-Speed',
        'Diancie',
        'Genesect',
        'Genesect-Burn',
        'Genesect-Chill',
        'Genesect-Douse',
        'Genesect-Shock',
        'Hoopa',
        'Hoopa-Unbound',
        'Jirachi',
        'Keldeo',
        'Keldeo-Resolute',
        'Magearna',
        'Manaphy',
        'Marshadow',
        'Meloetta',
        'Mew',
        'Phione',
        'Shaymin',
        'Shaymin-Sky',
        'Victini',
        'Volcanion',
        'Zeraora',
      ]);
    });
    it('should create pool containing only Gen 8 Restricted Legendary Pokémon', () => {
      const poolGenerator = new PoolGenerator();
      const gen = 8;
      const pool = new Pool(false, false, true, false, false, 0, 0);

      const eligiblePokemon = poolGenerator.eligiblePokemon(gen, pool);
      const eligiblePokemonNames = eligiblePokemon
        .map(pokemon => pokemon.name)
        .sort();

      expect(eligiblePokemonNames).toStrictEqual([
        'Calyrex',
        'Calyrex-Ice',
        'Calyrex-Shadow',
        'Cosmoem',
        'Cosmog',
        'Dialga',
        'Eternatus',
        'Giratina',
        'Giratina-Origin',
        'Groudon',
        'Ho-Oh',
        'Kyogre',
        'Kyurem',
        'Kyurem-Black',
        'Kyurem-White',
        'Lugia',
        'Lunala',
        'Mewtwo',
        'Necrozma',
        'Necrozma-Dawn-Wings',
        'Necrozma-Dusk-Mane',
        'Palkia',
        'Rayquaza',
        'Reshiram',
        'Solgaleo',
        'Xerneas',
        'Yveltal',
        'Zacian',
        'Zamazenta',
        'Zekrom',
        'Zygarde',
        'Zygarde-10%',
      ]);
    });
    it('should create pool containing only Gen 8 Sub-Legendary Pokémon', () => {
      const poolGenerator = new PoolGenerator();
      const gen = 8;
      const pool = new Pool(false, false, false, true, false, 0, 0);

      const eligiblePokemon = poolGenerator.eligiblePokemon(gen, pool);
      const eligiblePokemonNames = eligiblePokemon
        .map(pokemon => pokemon.name)
        .sort();

      expect(eligiblePokemonNames).toStrictEqual([
        'Articuno',
        'Articuno-Galar',
        'Azelf',
        'Blacephalon',
        'Buzzwole',
        'Celesteela',
        'Cobalion',
        'Cresselia',
        'Entei',
        'Glastrier',
        'Guzzlord',
        'Heatran',
        'Kartana',
        'Kubfu',
        'Landorus',
        'Landorus-Therian',
        'Latias',
        'Latios',
        'Mesprit',
        'Moltres',
        'Moltres-Galar',
        'Naganadel',
        'Nihilego',
        'Pheromosa',
        'Poipole',
        'Raikou',
        'Regice',
        'Regidrago',
        'Regieleki',
        'Regigigas',
        'Regirock',
        'Registeel',
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
        'Spectrier',
        'Stakataka',
        'Suicune',
        'Tapu Bulu',
        'Tapu Fini',
        'Tapu Koko',
        'Tapu Lele',
        'Terrakion',
        'Thundurus',
        'Thundurus-Therian',
        'Tornadus',
        'Tornadus-Therian',
        'Type: Null',
        'Urshifu',
        'Urshifu-Rapid-Strike',
        'Uxie',
        'Virizion',
        'Xurkitree',
        'Zapdos',
        'Zapdos-Galar',
      ]);
    });
  });
});
