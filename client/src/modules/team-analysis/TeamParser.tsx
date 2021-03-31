import React, {useState} from 'react';
import dynamic from 'next/dynamic';
import {Button, Grid} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import {PartialPokemonSet} from '../../pkmn/PokeInfo';
import {TeamParserDialogProps} from './TeamParserDialog';

const TeamParserDialog = dynamic<TeamParserDialogProps>(() =>
  import('./TeamParserDialog').then(m => m.TeamParserDialog)
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
    <>
      <TeamParserDialog open={open} onClose={closeDialog} onParse={onParse} />

      <Grid container justify="center">
        <Grid item>
          <Button variant="contained" onClick={openDialog} color="primary">
            <Add />
            Import from showdown
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
