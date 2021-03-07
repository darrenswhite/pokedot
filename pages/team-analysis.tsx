import React, {useState} from 'react';
import {Grid} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {DefensiveCoverageTable} from 'src/components/team/DefensiveCoverageTable';
import {TeamParser} from 'src/components/team/TeamParser';
import {TeamInfo} from 'src/info/TeamInfo';

const TeamAnalysis: React.FC = () => {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [teamParserError, setTeamParserError] = useState<unknown>(null);
  let results;

  const parserSuccess = (teamInfo: TeamInfo) => {
    setTeamInfo(teamInfo);
    setTeamParserError(null);
  };

  const parserError = (err: unknown) => {
    setTeamInfo(null);
    setTeamParserError(err);
  };

  if (teamParserError) {
    results = <Alert severity="error">Failed to parse team.</Alert>;
  } else if (teamInfo) {
    results = (
      <React.Fragment>
        <DefensiveCoverageTable teamInfo={teamInfo} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={6}>
          <TeamParser onParse={parserSuccess} onError={parserError} />
        </Grid>

        <Grid item xs={12}>
          {results}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default TeamAnalysis;
