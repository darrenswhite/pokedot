import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {Button, Grid} from '@material-ui/core';
import {Send} from '@material-ui/icons';
import {TeamGeneratorConfiguration} from './TeamGeneratorConfiguration';
import {
  GeneratedTeam,
  TeamGenerator,
  TeamGeneratorOptions,
} from '../../pkmn/TeamGenerator';
import {GeneratedTeamsTableProps} from './GeneratedTeamsTable';

const GeneratedTeamsTable = dynamic<GeneratedTeamsTableProps>(() =>
  import('./GeneratedTeamsTable').then(m => m.GeneratedTeamsTable)
);

const DEFAULT_SAMPLE_SIZE = 6;
const DEFAULT_REVEAL = 2000;

export const TeamGeneratorPage: React.FC = () => {
  const [options, setOptions] = useState<TeamGeneratorOptions>({
    players: [],
    sampleSize: DEFAULT_SAMPLE_SIZE,
    reveal: DEFAULT_REVEAL,
  });
  const [generatedTeams, setGeneratedTeams] = useState<GeneratedTeam[]>([]);
  let results;

  if (options.players.length > 0) {
    results = (
      <Grid item xs={12}>
        <GeneratedTeamsTable options={options} teams={generatedTeams} />
      </Grid>
    );
  }

  const generateTeams = async () => {
    const teams = await TeamGenerator.generate(options);

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
        <Grid item xs={12} sm={8}>
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
