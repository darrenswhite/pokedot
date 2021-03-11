import React, {useState} from 'react';
import {Grid} from '@material-ui/core';
import {DefensiveCoverageTable} from 'src/components/team/DefensiveCoverageTable';
import {OffensiveCoverageTable} from 'src/components/team/OffensiveCoverageTable';
import {TeamParser} from 'src/components/team/TeamParser';
import {TeamInfo} from 'src/info/TeamInfo';

const TeamAnalysis: React.FC = () => {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  let results;

  if (teamInfo) {
    results = (
      <React.Fragment>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <DefensiveCoverageTable teamInfo={teamInfo} />
          </Grid>

          <Grid item xs={12}>
            <OffensiveCoverageTable teamInfo={teamInfo} />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={6}>
          <TeamParser onParse={setTeamInfo} />
        </Grid>

        <Grid item xs={12}>
          {results}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default TeamAnalysis;
