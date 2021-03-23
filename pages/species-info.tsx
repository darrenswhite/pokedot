import React, {useState} from 'react';
import {Grid} from '@material-ui/core';
import {DefensiveTable} from '../src/components/coverage/DefensiveTable';
import {SpeciesSearch} from '../src/components/species/SpeciesSearch';
import {PartialPokemonSet} from '../src/info/PokeInfo';
import {SummaryCard} from '../src/components/coverage/SummaryCard';

const SpeciesInfo: React.FC = () => {
  const [pokemonSets, setPokemonSets] = useState<PartialPokemonSet[]>([]);
  let defensiveTable;
  let summaryCard;

  if (pokemonSets.length > 0) {
    defensiveTable = (
      <DefensiveTable
        pokemonSets={pokemonSets}
        columnField="species"
        rowField="resistance"
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

export default SpeciesInfo;
