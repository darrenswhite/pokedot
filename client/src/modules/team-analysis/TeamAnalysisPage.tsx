import {Button, Card, CardContent, CardHeader, Grid} from '@material-ui/core';
import {ArrowBack, ArrowForward, Check} from '@material-ui/icons';
import dynamic from 'next/dynamic';
import React, {useState} from 'react';

import {useTeam} from '../../hooks/useTeam';
import {DefensiveTableProps} from '../coverage/DefensiveTable';
import {OffensiveTableProps} from '../coverage/OffensiveTable';
import {SummaryCardProps} from '../coverage/SummaryCard';

import {PokemonCardProps} from './PokemonCard';
import {SpeciesSearch} from './SpeciesSearch';
import {TeamParser} from './TeamParser';
import {TeamValidationDialogProps} from './TeamValidationDialog';

const DefensiveTable = dynamic<DefensiveTableProps>(() =>
  import('../coverage/DefensiveTable').then(m => m.DefensiveTable)
);

const OffensiveTable = dynamic<OffensiveTableProps>(() =>
  import('../coverage/OffensiveTable').then(m => m.OffensiveTable)
);

const SummaryCard = dynamic<SummaryCardProps>(() =>
  import('../coverage/SummaryCard').then(m => m.SummaryCard)
);

const PokemonCard = dynamic<PokemonCardProps>(() =>
  import('./PokemonCard').then(m => m.PokemonCard)
);

const TeamValidationDialog = dynamic<TeamValidationDialogProps>(() =>
  import('./TeamValidationDialog').then(m => m.TeamValidationDialog)
);

const TeamAnalysis: React.FC = () => {
  const {
    team,
    setTeam,
    addPokemon,
    removePokemon,
    updatePokemon,
    undo,
    redo,
    canUndo,
    canRedo,
    validate,
  } = useTeam();
  const [validationDialogOpen, setValidationDialogOpen] =
    useState<boolean>(false);
  const [validationProblems, setValidationProblems] =
    useState<string[] | null>(null);

  const validateTeam = async () => {
    setValidationProblems(await validate());
    openValidationDialog();
  };

  const openValidationDialog = () => setValidationDialogOpen(true);
  const closeValidationDialog = () => setValidationDialogOpen(false);

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item>
        <Grid container wrap="nowrap" spacing={1}>
          <Grid item>
            <Button
              variant="contained"
              onClick={undo}
              color="primary"
              disabled={canUndo}
              aria-label="undo"
            >
              <ArrowBack />
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              onClick={redo}
              color="primary"
              disabled={canRedo}
              aria-label="redo"
            >
              <ArrowForward />
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <TeamParser value={team} onParse={setTeam} />
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          onClick={validateTeam}
          color="primary"
          disabled={team.length === 0}
        >
          <Check />
          Validate
        </Button>
      </Grid>

      <Grid container item justifyContent="center">
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <SpeciesSearch onChange={addPokemon} />
        </Grid>
      </Grid>

      <TeamValidationDialog
        open={validationDialogOpen}
        onClose={closeValidationDialog}
        problems={validationProblems}
      />

      {team.length === 0 && (
        <Grid container item justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card>
              <CardHeader title="No Pokémon added." />

              <CardContent>
                To start, use the search above to find a Pokémon to add to your
                team, or import a team from Pokémon Showdown Teambuilder.
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {team.length > 0 && (
        <Grid container item justifyContent="center" spacing={2}>
          {team.map((pokemon, index) => (
            <Grid key={index} item>
              <PokemonCard
                pokemon={pokemon}
                onChange={recipe => updatePokemon(index, recipe)}
                onRemove={() => removePokemon(index)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {team.length > 0 && (
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={8}
          lg={6}
          xl={4}
          justifyContent="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <DefensiveTable
              pokemonSets={team}
              columnField="species"
              idField="effectiveness"
              valueField="type"
            />
          </Grid>

          <Grid item xs={12}>
            <OffensiveTable
              pokemonSets={team}
              columnField="species"
              idField="effectiveness"
              valueField="type"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <SummaryCard pokemonSets={team} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default TeamAnalysis;
