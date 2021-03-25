import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {Grid} from '@material-ui/core';
import {DefensiveMatrixTableProps} from '../src/components/coverage/DefensiveMatrixTable';
import {OffensiveMatrixTableProps} from '../src/components/coverage/OffensiveMatrixTable';
import {SummaryCardProps} from '../src/components/coverage/SummaryCard';
import {PartialPokemonSet} from '../src/info/PokeInfo';
import {TeamParser} from '../src/components/team/TeamParser';

const DefensiveMatrixTable = dynamic<DefensiveMatrixTableProps>(() =>
  import('../src/components/coverage/DefensiveMatrixTable').then(
    module => module.DefensiveMatrixTable
  )
);

const OffensiveMatrixTable = dynamic<OffensiveMatrixTableProps>(() =>
  import('../src/components/coverage/OffensiveMatrixTable').then(
    module => module.OffensiveMatrixTable
  )
);

const SummaryCard = dynamic<SummaryCardProps>(() =>
  import('../src/components/coverage/SummaryCard').then(
    module => module.SummaryCard
  )
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
