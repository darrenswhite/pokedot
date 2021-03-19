import React, {useState} from 'react';
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

export interface TeamParserProps {
  onParse: (team: Team) => void;
}

export const TeamParser: React.FC<TeamParserProps> = ({
  onParse,
}: TeamParserProps) => {
  const [team, setTeam] = useState<string>();
  const [parseError, setParseError] = useState<string>();
  const [open, setOpen] = React.useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);
  const parseTeam = () => {
    if (team) {
      const teamInfo = Team.fromString(team);

      if (teamInfo) {
        setParseError('');
        onParse(teamInfo);
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
      <Dialog open={open} onClose={closeDialog}>
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
