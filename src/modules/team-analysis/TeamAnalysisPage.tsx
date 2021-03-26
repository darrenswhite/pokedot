import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {Grid} from '@material-ui/core';
import {DefensiveTableProps} from '../coverage/DefensiveTable';
import {OffensiveTableProps} from '../coverage/OffensiveTable';
import {SummaryCardProps} from '../coverage/SummaryCard';
import {PartialPokemonSet} from '../../pkmn/PokeInfo';
import {TeamParser} from './TeamParser';

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
          <TeamParser onParse={setPokemonSets} />
        </Grid>

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
