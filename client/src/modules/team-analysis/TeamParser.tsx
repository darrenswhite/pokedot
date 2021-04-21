import {Button} from '@material-ui/core';
import {ImportExport} from '@material-ui/icons';
import dynamic from 'next/dynamic';
import React, {useState} from 'react';

import {PartialPokemonSet} from '../../pkmn/PartialPokemonSet';

import {TeamParserDialogProps} from './TeamParserDialog';

const TeamParserDialog = dynamic<TeamParserDialogProps>(() =>
  import('./TeamParserDialog').then(m => m.TeamParserDialog)
);

export interface TeamParserProps {
  value: PartialPokemonSet[];
  onParse: (pokemonSets: PartialPokemonSet[]) => void;
}

export const TeamParser: React.FC<TeamParserProps> = ({
  value,
  onParse,
}: TeamParserProps) => {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <>
      <TeamParserDialog
        value={value}
        open={open}
        onClose={closeDialog}
        onParse={onParse}
      />

      <Button variant="contained" onClick={openDialog} color="primary">
        <ImportExport />
        Import / Export Showdown
      </Button>
    </>
  );
};
