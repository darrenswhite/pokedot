import React, {useRef, useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import {Team} from '@pkmn/sets';
import {PartialPokemonSet} from '../../info/PokeInfo';

export interface TeamParserProps {
  onParse: (pokemonSets: PartialPokemonSet[]) => void;
}

export const TeamParser: React.FC<TeamParserProps> = ({
  onParse,
}: TeamParserProps) => {
  const [team, setTeam] = useState<string>();
  const [parseError, setParseError] = useState<string>();
  const [open, setOpen] = useState(false);
  const teamInputRef = useRef<HTMLInputElement>(null);

  const openDialog = () => {
    setOpen(true);
  };
  const focusTeamInput = () => {
    if (teamInputRef.current) {
      teamInputRef.current.focus();
    }
  };
  const closeDialog = () => setOpen(false);
  const parseTeam = () => {
    if (team) {
      const parsedTeam = Team.fromString(team);

      if (parsedTeam) {
        setParseError('');
        onParse(parsedTeam.team as PartialPokemonSet[]);
        closeDialog();
      } else {
        console.error(`Failed to parse team.`);
        setParseError('Invalid team.');
      }
    } else {
      setParseError('Team is required');
    }
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={closeDialog} onEntered={focusTeamInput}>
        <DialogTitle>Import team</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Import a team from Pokémon Showdown teambuilder. Export the team,
            then copy and paste it here.
          </DialogContentText>

          <TextField
            value={team}
            onChange={e => setTeam(e.currentTarget.value)}
            label="Team details"
            helperText={parseError}
            error={!!parseError}
            rowsMax={10}
            inputRef={teamInputRef}
            multiline
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={parseTeam} color="primary">
            Import
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container justify="center">
        <Grid item>
          <Button variant="contained" onClick={openDialog} color="primary">
            <Add />
            Import team
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
