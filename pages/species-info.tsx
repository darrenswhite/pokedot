import React, {useState} from 'react';
import {Grid} from '@material-ui/core';
import {DefensiveTable} from '../src/components/coverage/DefensiveTable';
import {SpeciesSearch} from '../src/components/species/SpeciesSearch';
import {PartialPokemonSet} from '../src/info/PokeInfo';

const SpeciesInfo: React.FC = () => {
  const [pokemonSets, setPokemonSets] = useState<PartialPokemonSet[]>([]);
  let results;

  if (pokemonSets.length > 0) {
    results = (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DefensiveTable
            pokemonSets={pokemonSets}
            columnField="species"
            rowField="resistance"
            valueField="type"
          />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container justify="center" spacing={2}>
      <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
        <SpeciesSearch onSelect={setPokemonSets} />
      </Grid>

      <Grid item xs={12}>
        {results}
      </Grid>
    </Grid>
  );
};

export default SpeciesInfo;
