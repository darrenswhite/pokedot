import React, {useState} from 'react';
import {Button, Grid} from '@material-ui/core';
import {Send} from '@material-ui/icons';
import {TeamGeneratorConfiguration} from './TeamGeneratorConfiguration';
import {
  RandomGeneratedTeam,
  RandomTeamGenerator,
  RandomTeamGeneratorOptions,
} from '../../pkmn/RandomTeamGenerator';
import {TeamGeneratorResults} from './TeamGeneratorResults';

export const TeamGenerator: React.FC = () => {
  const [options, setOptions] = useState<RandomTeamGeneratorOptions>({
    players: [],
    sampleSize: 6,
    revealMs: 2000,
  });
  const [generatedTeams, setGeneratedTeams] = useState<RandomGeneratedTeam[]>(
    []
  );
  let results;

  if (options.players.length > 0) {
    results = (
      <Grid item xs={12}>
        <TeamGeneratorResults options={options} teams={generatedTeams} />
      </Grid>
    );
  }

  const generateTeams = async () => {
    const teams = await RandomTeamGenerator.generate(options);

    setGeneratedTeams(teams);
  };

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
          <TeamGeneratorConfiguration value={options} onChange={setOptions} />
        </Grid>

        <Grid item container xs={12} justify="center">
          <Grid item>
            <Button variant="contained" onClick={generateTeams} color="primary">
              <Send />
              Generate
            </Button>
          </Grid>
        </Grid>

        {results}
      </Grid>
    </Grid>
  );
};
