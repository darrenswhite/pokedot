import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {Grid} from '@material-ui/core';
import {DefensiveTableProps} from '../coverage/DefensiveTable';
import {SummaryCardProps} from '../coverage/SummaryCard';
import {SpeciesSearch} from './SpeciesSearch';
import {PartialPokemonSet} from '../../pkmn/PokeInfo';

const DefensiveTable = dynamic<DefensiveTableProps>(() =>
  import('../coverage/DefensiveTable').then(m => m.DefensiveTable)
);

const SummaryCard = dynamic<SummaryCardProps>(() =>
  import('../coverage/SummaryCard').then(m => m.SummaryCard)
);

export const PokemonInfoPage: React.FC = () => {
  const [pokemonSets, setPokemonSets] = useState<PartialPokemonSet[]>([]);
  let defensiveTable;
  let summaryCard;

  if (pokemonSets.length > 0) {
    defensiveTable = (
      <DefensiveTable
        pokemonSets={pokemonSets}
        columnField="species"
        idField="effectiveness"
        valueField="type"
      />
    );
    summaryCard = <SummaryCard pokemonSets={pokemonSets} />;
  }

  return (
    <Grid container justify="center">
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
          <SpeciesSearch onSelect={setPokemonSets} />
        </Grid>

        <Grid item xs={12}>
          {defensiveTable}
        </Grid>

        <Grid item xs={12} sm={6}>
          {summaryCard}
        </Grid>
      </Grid>
    </Grid>
  );
};
