import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@material-ui/core';
import {GenerationNum} from '@pkmn/data';
import axios from 'axios';
import React, {useEffect, useState} from 'react';

import {serverUrl} from '../../util/constants';
import {SpeciesImage, SpeciesImageType} from '../species/SpeciesImage';

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <DialogTitle>Eligible Pokémon</DialogTitle>

      <DialogContent>
        {isLoading && <CircularProgress />}

        {!isLoading && error && <Typography>{error}</Typography>}

        {!isLoading && !error && (
          <Grid container justify="center">
            {eligiblePokemon.map(pokemon => (
              <Grid item key={pokemon.name}>
                <SpeciesImage
                  type={SpeciesImageType.SPRITE}
                  name={pokemon.name}
                  showTooltip
                />
              </Grid>
            ))}
          </Grid>
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
