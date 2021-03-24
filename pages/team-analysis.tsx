import React, {useState} from 'react';
import {Grid} from '@material-ui/core';
import {DefensiveMatrixTable} from '../src/components/coverage/DefensiveMatrixTable';
import {OffensiveMatrixTable} from '../src/components/coverage/OffensiveMatrixTable';
import {PartialPokemonSet} from '../src/info/PokeInfo';
import {SummaryCard} from '../src/components/coverage/SummaryCard';
import {TeamParser} from '../src/components/team/TeamParser';

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
