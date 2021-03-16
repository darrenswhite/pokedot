import React, {useState} from 'react';
import {Grid} from '@material-ui/core';
import {DefensiveCoverageTable} from '../src/components/team/DefensiveCoverageTable';
import {OffensiveCoverageTable} from '../src/components/team/OffensiveCoverageTable';
import {TeamParser} from '../src/components/team/TeamParser';
import {PartialPokemonSet} from '../src/info/PokeInfo';

const TeamAnalysis: React.FC = () => {
  const [pokemonSets, setPokemonSets] = useState<PartialPokemonSet[]>([]);
  let results;

  if (pokemonSets.length > 0) {
    results = (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DefensiveCoverageTable pokemonSets={pokemonSets} />
        </Grid>

        <Grid item xs={12}>
          <OffensiveCoverageTable pokemonSets={pokemonSets} />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container justify="center" spacing={2}>
      <Grid item xs={6}>
        <TeamParser onParse={setPokemonSets} />
      </Grid>

      <Grid item xs={12}>
        {results}
      </Grid>
    </Grid>
  );
};

export default TeamAnalysis;
