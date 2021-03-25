import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {Grid} from '@material-ui/core';
import {DefensiveMatrixTableProps} from '../coverage/DefensiveMatrixTable';
import {OffensiveMatrixTableProps} from '../coverage/OffensiveMatrixTable';
import {SummaryCardProps} from '../coverage/SummaryCard';
import {PartialPokemonSet} from '../../info/PokeInfo';
import {TeamParser} from './TeamParser';

const DefensiveMatrixTable = dynamic<DefensiveMatrixTableProps>(() =>
  import('../coverage/DefensiveMatrixTable').then(m => m.DefensiveMatrixTable)
);

const OffensiveMatrixTable = dynamic<OffensiveMatrixTableProps>(() =>
  import('../coverage/OffensiveMatrixTable').then(m => m.OffensiveMatrixTable)
);

const SummaryCard = dynamic<SummaryCardProps>(() =>
  import('../coverage/SummaryCard').then(m => m.SummaryCard)
);

const TeamAnalysis: React.FC = () => {
  const [pokemonSets, setPokemonSets] = useState<PartialPokemonSet[]>([]);
  let defensiveMatrixTable;
  let offensiveMatrixTable;
  let summaryCard;

  if (pokemonSets.length > 0) {
    defensiveMatrixTable = (
      <DefensiveMatrixTable
        pokemonSets={pokemonSets}
        columnField="species"
        idField="effectiveness"
        valueField="type"
      />
    );
    offensiveMatrixTable = (
      <OffensiveMatrixTable
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
          {defensiveMatrixTable}
        </Grid>

        <Grid item xs={12}>
          {offensiveMatrixTable}
        </Grid>

        <Grid item xs={12} sm={6}>
          {summaryCard}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TeamAnalysis;
