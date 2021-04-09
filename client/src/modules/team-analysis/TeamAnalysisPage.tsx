import {Card, CardContent, CardHeader, Grid} from '@material-ui/core';
import {PokemonSet} from '@pkmn/types';
import dynamic from 'next/dynamic';
import React, {useCallback, useContext} from 'react';

import {PartialPokemonSet} from '../../pkmn/PartialPokemonSet';
import {DefensiveTableProps} from '../coverage/DefensiveTable';
import {OffensiveTableProps} from '../coverage/OffensiveTable';
import {SummaryCardProps} from '../coverage/SummaryCard';

import {PokemonCardProps} from './PokemonCard';
import {SpeciesSearch} from './SpeciesSearch';
import {TeamParser} from './TeamParser';
import {TeamActionType, TeamContext} from './TeamProvider';

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

const createPokemon = (pokemon: PartialPokemonSet): PokemonSet => {
  return {
    name: pokemon.name ?? '',
    species: pokemon.species,
    item: pokemon.item ?? '',
    ability: pokemon.ability ?? '',
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
    happiness: pokemon.happiness ?? 255,
    pokeball: pokemon.pokeball ?? '',
    hpType: pokemon.hpType ?? '',
    gigantamax: pokemon.gigantamax ?? false,
  };
};

const TeamAnalysis: React.FC = () => {
  const {state, dispatch} = useContext(TeamContext);
  let notice;
  let teamCards;
  let analysis;

  const setTeam = (pokemon: PartialPokemonSet[]) => {
    dispatch({
      type: TeamActionType.SET_TEAM,
      pokemon: pokemon.map(createPokemon),
    });
  };

  const addPokemon = (species: string) => {
    if (state.team.length < 6) {
      const pokemon = createPokemon({
        species,
      });

      dispatch({
        type: TeamActionType.ADD_POKEMON,
        pokemon,
      });
    }
  };

  const removePokemon = (index: number) => {
    dispatch({
      type: TeamActionType.REMOVE_POKEMON,
      index,
    });
  };

  const updatePokemon = (index: number, pokemon: PokemonSet) => {
    dispatch({
      type: TeamActionType.UPDATE_POKEMON,
      index,
      pokemon,
    });
  };

  const RenderPokemonCard: React.FC<{pokemon: PokemonSet; index: number}> = ({
    pokemon,
    index,
  }: {
    pokemon: PokemonSet;
    index: number;
  }) => {
    const onChange = useCallback(
      pokemon => {
        if (pokemon) {
          updatePokemon(index, pokemon);
        } else {
          removePokemon(index);
        }
      },
      [index]
    );

    return <PokemonCard pokemon={pokemon} onChange={onChange} />;
  };

  if (state.team.length > 0) {
    teamCards = (
      <Grid container item xs={12} justify="center" spacing={4}>
        {state.team.map((pokemon, index) => (
          <Grid key={index} item>
            <RenderPokemonCard pokemon={pokemon} index={index} />
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
            pokemonSets={state.team}
            columnField="species"
            idField="effectiveness"
            valueField="type"
          />
        </Grid>

        <Grid item xs={12}>
          <OffensiveTable
            pokemonSets={state.team}
            columnField="species"
            idField="effectiveness"
            valueField="type"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <SummaryCard pokemonSets={state.team} />
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
        <TeamParser value={state.team} onParse={setTeam} />
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
