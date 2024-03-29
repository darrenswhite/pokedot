import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import {PokemonSet, Team} from '@pkmn/sets';
import React, {useEffect, useState} from 'react';

import {PartialPokemonSet} from '../../pkmn/PartialPokemonSet';

export interface TeamParserDialogProps {
  value: PartialPokemonSet[];
  open: boolean;
  onClose: () => void;
  onParse: (pokemonSets: PartialPokemonSet[]) => void;
}

export const TeamParserDialog: React.FC<TeamParserDialogProps> = ({
  value,
  open,
  onClose,
  onParse,
}: TeamParserDialogProps) => {
  const [team, setTeam] = useState<string>('');
  const [parseError, setParseError] = useState<string>();

  useEffect(() => {
    if (open) {
      setTeam(new Team(value as PokemonSet[]).toString());
    }
  }, [value, open]);

  const parseTeam = () => {
    if (team) {
      const parsedTeam = Team.fromString(team);

      if (parsedTeam) {
        setParseError('');
        setTeam('');
        onParse(parsedTeam.team as PartialPokemonSet[]);
        onClose();
      } else {
        console.error(`Failed to parse team.`);
        setParseError('Invalid team.');
      }
    } else {
      setParseError('Team is required');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Import / Export Showdown Team</DialogTitle>

      <DialogContent>
        <DialogContentText>
          <Typography gutterBottom>
            To import a team: Export a team from Pokémon Showdown Teambuilder,
            then copy and paste it here.
          </Typography>

          <Typography gutterBottom>
            To export a team: Copy the text below and import it into Pokémon
            Showdown Teambuilder.
          </Typography>
        </DialogContentText>

        <TextField
          value={team}
          onChange={e => setTeam(e.currentTarget.value)}
          label="Team details"
          margin="dense"
          helperText={parseError}
          error={!!parseError}
          maxRows={10}
          autoFocus
          multiline
          fullWidth
          variant={'standard'}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>

        <Button onClick={parseTeam} color="primary">
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};
