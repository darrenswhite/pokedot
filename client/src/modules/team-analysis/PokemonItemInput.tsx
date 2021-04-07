import {Box, TextField} from '@material-ui/core';
import {Autocomplete, createFilterOptions} from '@material-ui/lab';
import {Item, PokemonSet} from '@pkmn/data';
import React, {useContext, useEffect, useState} from 'react';

import {useSpecie} from '../../hooks/useSpecies';
import {GenerationContext} from '../generation/GenerationProvider';

import {PokemonAction, PokemonActionType} from './PokemonCard';

export interface PokemonItemInputProps {
  pokemon: PokemonSet;
  dispatch: React.Dispatch<PokemonAction>;
}

export const PokemonItemInput: React.FC<PokemonItemInputProps> = ({
  pokemon,
  dispatch,
}: PokemonItemInputProps) => {
  const {generation} = useContext(GenerationContext);
  const specie = useSpecie(pokemon.species);
  const [items, setItems] = useState<Item[]>([]);
  const options = items.map(item => item.name);
  const filterOptions = createFilterOptions<string>({
    limit: 5,
  });
  const item = pokemon.item;
  const nullableItem = item && item.length > 0 ? item : null;

  useEffect(() => {
    if (generation && specie) {
      setItems(Array.from(generation.items));
    }
  }, [generation, specie]);

  return (
    <Box width="220px">
      <Autocomplete
        options={options}
        value={nullableItem}
        filterOptions={filterOptions}
        size="small"
        renderInput={params => (
          <TextField
            {...params}
            label="Item"
            placeholder="Select an item"
            size="small"
            fullWidth
          />
        )}
        onChange={(_, value) =>
          dispatch({
            type: PokemonActionType.SET_ITEM,
            item: value ?? '',
          })
        }
        fullWidth
      />
    </Box>
  );
};
