import {Grid} from '@material-ui/core';
import dynamic from 'next/dynamic';
import React, {useState} from 'react';

import {PartialPokemonSet} from '../../pkmn/PokeInfo';
import {DefensiveTableProps} from '../coverage/DefensiveTable';
import {OffensiveTableProps} from '../coverage/OffensiveTable';
import {SummaryCardProps} from '../coverage/SummaryCard';
import {SpeciesSearch} from '../species-info/SpeciesSearch';

import {PokemonCardProps} from './PokemonCard';
import {TeamParser} from './TeamParser';

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
  const [pokemonSets, setPokemonSets] = useState<PartialPokemonSet[]>([]);
  let defensiveTable;
  let offensiveTable;
  let summaryCard;

  const addPokemon = (pokemon: PartialPokemonSet) => {
    if (
      pokemonSets.length < 6 &&
      !pokemonSets.find(p => p.species === pokemon.species)
    ) {
      setPokemonSets([...pokemonSets, pokemon as PartialPokemonSet]);
    }
  };

  const removePokemon = (index: number) => {
    setPokemonSets(pokemonSets.filter((_, i) => i !== index));
  };

  const updatePokemon = (index: number, updated: PartialPokemonSet) => {
    setPokemonSets(
      pokemonSets.map((pokemon, i) => (i === index ? updated : pokemon))
    );
  };

  if (pokemonSets.length > 0) {
    defensiveTable = (
      <DefensiveTable
        pokemonSets={pokemonSets}
        columnField="species"
        idField="effectiveness"
        valueField="type"
      />
    );
    offensiveTable = (
      <OffensiveTable
        pokemonSets={pokemonSets}
        columnField="species"
        idField="effectiveness"
        valueField="type"
      />
    );
    summaryCard = (
      <SummaryCard pokemonSets={pokemonSets} showOffensiveSummary />
    );
  }

  return (
    <Grid container justify="center" spacing={4}>
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
          <SpeciesSearch onChange={addPokemon} />
        </Grid>

        <Grid item xs={12}>
          <TeamParser onParse={setPokemonSets} />
        </Grid>
      </Grid>

      <Grid container item xs={12} justify="center" spacing={4}>
        {pokemonSets.map((pokemon, index) => (
          <Grid key={pokemon.species} item>
            <PokemonCard
              pokemon={pokemon}
              onRemove={() => removePokemon(index)}
              onUpdate={pokemon => updatePokemon(index, pokemon)}
            />
          </Grid>
        ))}
      </Grid>

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
          {defensiveTable}
        </Grid>

        <Grid item xs={12}>
          {offensiveTable}
        </Grid>

        <Grid item xs={12} sm={6}>
          {summaryCard}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TeamAnalysis;
