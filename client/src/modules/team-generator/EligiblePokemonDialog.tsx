import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import React, {useContext} from 'react';
import {AutoSizer, List, ListRowProps} from 'react-virtualized';

import {SpeciesImage, SpeciesImageType} from '../species/SpeciesImage';
import {SpeciesContext} from '../species/SpeciesProvider';

import {Pokemon} from './TeamGeneratorState';

export interface EligiblePokemonDialogProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
  eligiblePokemon: Pokemon[];
}

export const EligiblePokemonDialog: React.FC<EligiblePokemonDialogProps> = ({
  open,
  onClose,
  isLoading,
  error,
  eligiblePokemon,
}: EligiblePokemonDialogProps) => {
  const {setOpen, setSpecies} = useContext(SpeciesContext);
  const sortedEligiblePokemon = eligiblePokemon.sort(
    (left, right) => left.num - right.num
  );

  const showMoreInfo = (name: string) => {
    setSpecies(name);
    setOpen(true);
  };

  const renderRow = ({key, index, style}: ListRowProps) => {
    const pokemon = sortedEligiblePokemon[index] as Pokemon;

    return (
      <ListItem
        key={key}
        style={style}
        button
        onClick={() => showMoreInfo(pokemon.name)}
      >
        <ListItemAvatar>
          <SpeciesImage name={pokemon.name} type={SpeciesImageType.ICON} />
        </ListItemAvatar>

        <ListItemText primary={pokemon.name} />
      </ListItem>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{style: {height: 600, width: 400}}}
    >
      <DialogTitle>Eligible Pokémon</DialogTitle>

      <DialogContent>
        {isLoading && (
          <Grid container justify="center">
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        )}

        {!isLoading && error && (
          <Grid container justify="center">
            <Grid item>
              <Typography>{error}</Typography>
            </Grid>
          </Grid>
        )}

        {!isLoading && !error && (
          <div style={{flex: 1, height: '100%', width: '100%'}}>
            <AutoSizer>
              {({height, width}) => (
                <List
                  height={height}
                  width={width}
                  rowHeight={46}
                  rowCount={sortedEligiblePokemon.length}
                  rowRenderer={renderRow}
                />
              )}
            </AutoSizer>
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
