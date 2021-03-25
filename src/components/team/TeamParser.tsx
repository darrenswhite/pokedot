import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {Button, Grid} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import {PartialPokemonSet} from '../../info/PokeInfo';
import {TeamParserDialogProps} from './TeamParserDialog';

const TeamParserDialog = dynamic<TeamParserDialogProps>(() =>
  import('./TeamParserDialog').then(module => module.TeamParserDialog)
);

export interface TeamParserProps {
  onParse: (pokemonSets: PartialPokemonSet[]) => void;
}

export const TeamParser: React.FC<TeamParserProps> = ({
  onParse,
}: TeamParserProps) => {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <React.Fragment>
      <TeamParserDialog open={open} onClose={closeDialog} onParse={onParse} />

      <Grid container justify="center">
        <Grid item>
          <Button variant="contained" onClick={openDialog} color="primary">
            <Add />
            Import from showdown
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
