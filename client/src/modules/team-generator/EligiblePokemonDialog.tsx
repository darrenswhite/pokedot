import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import {GenerationNum} from '@pkmn/data';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';

import {serverUrl} from '../../util/constants';
import {SpeciesImage, SpeciesImageType} from '../species/SpeciesImage';
import {SpeciesContext} from '../species/SpeciesProvider';

import {Pokemon, Pool} from './TeamGeneratorState';

export interface EligiblePokemonDialogProps {
  open: boolean;
  onClose: () => void;
  gen: GenerationNum;
  pool: Pool;
}

export const EligiblePokemonDialog: React.FC<EligiblePokemonDialogProps> = ({
  open,
  onClose,
  gen,
  pool,
}: EligiblePokemonDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eligiblePokemon, setEligiblePokemon] = useState<Pokemon[]>([]);
  const {setOpen, setSpecies} = useContext(SpeciesContext);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setError(null);

      axios
        .post(`${serverUrl}/pools/eligiblePokemon/${gen}`, pool)
        .then(res => {
          setEligiblePokemon(res.data as Pokemon[]);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(`Failed to get eligible Pokémon for pool.`, err);
          setIsLoading(false);
          setError('Failed to load list of eligible Pokémon.');
        });
    }
  }, [open, gen, pool]);

  const showMoreInfo = (name: string) => {
    setSpecies(name);
    setOpen(true);
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
          <List dense>
            {eligiblePokemon
              .sort((left, right) => left.num - right.num)
              .map(pokemon => (
                <ListItem
                  key={pokemon.name}
                  button
                  onClick={() => showMoreInfo(pokemon.name)}
                >
                  <ListItemAvatar>
                    <SpeciesImage
                      name={pokemon.name}
                      type={SpeciesImageType.ICON}
                    />
                  </ListItemAvatar>

                  <ListItemText primary={pokemon.name} />
                </ListItem>
              ))}
          </List>
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
