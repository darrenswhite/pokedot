import {Card, CardContent, CardHeader, Grid} from '@material-ui/core';
import {PokemonSet} from '@pkmn/types';
import dynamic from 'next/dynamic';
import React, {useContext} from 'react';

import {PartialPokemonSet} from '../../pkmn/PokeInfo';
import {DefensiveTableProps} from '../coverage/DefensiveTable';
import {OffensiveTableProps} from '../coverage/OffensiveTable';
import {SummaryCardProps} from '../coverage/SummaryCard';

import {PokemonCardProps} from './PokemonCard';
import {SpeciesSearch} from './SpeciesSearch';
import {TeamParser} from './TeamParser';
import {TeamContext} from './TeamProvider';

const PokemonCard = dynamic<PokemonCardProps>(() =>
  import('./PokemonCard').then(m => m.PokemonCard)
);

const DefensiveTable = dynamic<DefensiveTableProps>(() =>
  import('../coverage/DefensiveTable').then(m => m.DefensiveTable)
);

const OffensiveTable = dynamic<OffensiveTableProps>(() =>
  import('../coverage/OffensiveTable').then(m => m.OffensiveTable)
);

const SummaryCard = dynamic<SummaryCardProps>(() =>
  import('../coverage/SummaryCard').then(m => m.SummaryCard)
);

const TeamAnalysis: React.FC = () => {
  const {team, setTeam} = useContext(TeamContext);
  let notice;
  let teamCards;
  let analysis;

  const createPokemon = (pokemon: PartialPokemonSet): PokemonSet => {
    return {
      name: pokemon.name ?? '',
      species: pokemon.species,
      item: pokemon.item ?? '',
      ability: pokemon.ability ?? '', // default to first ability
      moves: pokemon.moves
        ? [
            pokemon.moves[0] ?? '',
            pokemon.moves[1] ?? '',
            pokemon.moves[2] ?? '',
            pokemon.moves[3] ?? '',
          ]
        : ['', '', '', ''],
      nature: pokemon.nature ?? '',
      gender: pokemon.gender ?? '',
      evs: pokemon.evs
        ? {
            hp: pokemon.evs.hp ?? 0,
            atk: pokemon.evs.atk ?? 0,
            def: pokemon.evs.def ?? 0,
            spa: pokemon.evs.spa ?? 0,
            spd: pokemon.evs.spd ?? 0,
            spe: pokemon.evs.spe ?? 0,
          }
        : {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
      ivs: pokemon.ivs
        ? {
            hp: pokemon.ivs.hp ?? 31,
            atk: pokemon.ivs.atk ?? 31,
            def: pokemon.ivs.def ?? 31,
            spa: pokemon.ivs.spa ?? 31,
            spd: pokemon.ivs.spd ?? 31,
            spe: pokemon.ivs.spe ?? 31,
          }
        : {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
      level: pokemon.level ?? 50,
      shiny: pokemon.shiny ?? false,
      happiness: pokemon.happiness ?? 0,
      pokeball: pokemon.pokeball ?? '',
      hpType: pokemon.hpType ?? '',
      gigantamax: pokemon.gigantamax ?? false,
    };
  };

  const addPokemon = (species: string) => {
    if (team.length < 6 && !team.find(p => p.species === species)) {
      const pokemon = createPokemon({
        species,
      });

      setTeam([...team, pokemon]);
    }
  };

  const addAllPokemon = (pokemon: PartialPokemonSet[]) => {
    setTeam(pokemon.map(createPokemon));
  };

  const removePokemon = (index: number) => {
    setTeam([...team.slice(0, index), ...team.slice(index + 1)]);
  };

  const updatePokemon = (index: number, updated: PokemonSet) => {
    setTeam([...team.slice(0, index), updated, ...team.slice(index + 1)]);
  };

  if (team.length > 0) {
    teamCards = (
      <Grid container item xs={12} justify="center" spacing={4}>
        {team.map((pokemon, index) => (
          <Grid key={pokemon.species} item>
            <PokemonCard
              pokemon={pokemon}
              onRemove={() => removePokemon(index)}
              onUpdate={pokemon => updatePokemon(index, pokemon)}
            />
          </Grid>
        ))}
      </Grid>
    );

    analysis = (
      <Grid
        container
        item
        xs={12}
        sm={12}
        md={8}
        lg={6}
        xl={4}
        justify="center"
        spacing={4}
      >
        <Grid item xs={12}>
          <DefensiveTable
            pokemonSets={team}
            columnField="species"
            idField="effectiveness"
            valueField="type"
          />
        </Grid>

        <Grid item xs={12}>
          <OffensiveTable
            pokemonSets={team}
            columnField="species"
            idField="effectiveness"
            valueField="type"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <SummaryCard pokemonSets={team} showOffensiveSummary />
        </Grid>
      </Grid>
    );
  } else {
    notice = (
      <Grid container item xs={12} justify="center">
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Card>
            <CardHeader title="No Pokémon added." />

            <CardContent>
              To start, use the search above to find a Pokémon to add to your
              team, or import a team from Pokémon Showdown Teambuilder.
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container justify="center" spacing={2}>
      <Grid item>
        <TeamParser value={team} onParse={addAllPokemon} />
      </Grid>

      <Grid container item xs={12} justify="center">
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <SpeciesSearch onChange={addPokemon} />
        </Grid>
      </Grid>

      {notice}

      <Grid
        container
        item
        xs={12}
        sm={12}
        md={8}
        lg={6}
        xl={4}
        justify="center"
        alignItems="center"
        spacing={4}
        direction="column"
      ></Grid>

      {teamCards}

      {analysis}
    </Grid>
  );
};

export default TeamAnalysis;
