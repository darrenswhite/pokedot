import React, {useState} from 'react';
import {Grid} from '@material-ui/core';
import {Team} from '@pkmn/sets';
import {DefensiveCoverageTable} from '../src/components/team/DefensiveCoverageTable';
import {OffensiveCoverageTable} from '../src/components/team/OffensiveCoverageTable';
import {TeamParser} from '../src/components/team/TeamParser';

const TeamAnalysis: React.FC = () => {
  const [team, setTeam] = useState<Team | undefined>();
  let results;

  if (team) {
    results = (
      <React.Fragment>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <DefensiveCoverageTable pokemonSets={team.team} />
          </Grid>

          <Grid item xs={12}>
            <OffensiveCoverageTable pokemonSets={team.team} />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={6}>
          <TeamParser onParse={setTeam} />
        </Grid>

        <Grid item xs={12}>
          {results}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default TeamAnalysis;
