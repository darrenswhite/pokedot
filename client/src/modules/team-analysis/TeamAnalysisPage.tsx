import {Card, CardContent, CardHeader, Grid} from '@material-ui/core';
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

  const addPokemon = (pokemon: PartialPokemonSet) => {
    if (team.length < 6 && !team.find(p => p.species === pokemon.species)) {
      setTeam([...team, pokemon as PartialPokemonSet]);
    }
  };

  const removePokemon = (index: number) => {
    setTeam(team.filter((_, i) => i !== index));
  };

  const updatePokemon = (index: number, updated: PartialPokemonSet) => {
    setTeam(team.map((pokemon, i) => (i === index ? updated : pokemon)));
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
        <TeamParser value={team} onParse={setTeam} />
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
