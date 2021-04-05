import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';
import {PokemonSet, Team} from '@pkmn/sets';
import React, {useEffect, useRef, useState} from 'react';

import {PartialPokemonSet} from '../../pkmn/PokeInfo';

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
  const teamInputRef = useRef<HTMLInputElement>(null);

  const focusTeamInput = () => {
    if (teamInputRef.current) {
      teamInputRef.current.focus();
    }
  };

  useEffect(() => {
    setTeam(new Team(value as Readonly<PokemonSet[]>).toString());
  }, [value]);

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
    <Dialog open={open} onClose={onClose} onEntered={focusTeamInput}>
      <DialogTitle>Import / Export Showdown Team</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To import a team: Export a team from Pokémon Showdown Teambuilder,
          then copy and paste it here.
        </DialogContentText>

        <DialogContentText>
          To export a team: Copy the text below and import it into Pokémon
          Showdown Teambuilder.
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
