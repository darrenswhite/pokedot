import React, {useRef, useState} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import {Team} from '@pkmn/sets';
import {PartialPokemonSet} from '../../info/PokeInfo';

export interface TeamParserDialogProps {
  open: boolean;
  onClose: () => void;
  onParse: (pokemonSets: PartialPokemonSet[]) => void;
}

export const TeamParserDialog: React.FC<TeamParserDialogProps> = ({
  open,
  onClose,
  onParse,
}: TeamParserDialogProps) => {
  const [team, setTeam] = useState<string>();
  const [parseError, setParseError] = useState<string>();
  const teamInputRef = useRef<HTMLInputElement>(null);

  const focusTeamInput = () => {
    if (teamInputRef.current) {
      teamInputRef.current.focus();
    }
  };

  const parseTeam = () => {
    if (team) {
      const parsedTeam = Team.fromString(team);

      if (parsedTeam) {
        setParseError('');
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
      <DialogTitle>Import team</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Import a team from Pokémon Showdown teambuilder. Export the team, then
          copy and paste it here.
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
