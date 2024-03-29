import {Autocomplete, Box, Popper, TextField, Typography} from '@mui/material';
import {PokemonSet} from '@pkmn/data';
import React, {useContext, useEffect, useState} from 'react';

import {useSpecie} from '../../hooks/useSpecies';
import {GenerationContext} from '../generation/GenerationProvider';

export interface PokemonItemInputProps {
  pokemon: PokemonSet;
  onChange: (recipe: (pokemon: PokemonSet) => void) => void;
}

export const PokemonItemInput: React.FC<PokemonItemInputProps> = ({
  pokemon,
  onChange,
}: PokemonItemInputProps) => {
  const {generation, stats} = useContext(GenerationContext);
  const specie = useSpecie(pokemon.species);
  const [items, setItems] = useState<Record<string, number>>({});
  const options = Object.entries(items)
    .sort((left, right) => right[1] - left[1])
    .map(entry => entry[0]);
  const item = pokemon.item;
  const nullableItem = item && item.length > 0 ? item : null;

  useEffect(() => {
    if (generation && specie) {
      const specieStats = stats.data[specie.name];
      const itemStats = specieStats?.Items || {};
      const total = Object.values(itemStats).reduce(
        (total, curr) => total + curr,
        0
      );

      const items = Object.fromEntries(
        Object.entries(generation.dex.data.Items).map(([id, item]) => {
          const usage = itemStats[id] ?? 0;

          return [item.name, (usage / total) * 100];
        })
      );

      setItems(items);
    }
  }, [generation, specie, stats]);

  return (
    <Autocomplete
      options={options}
      value={nullableItem}
      size="small"
      renderInput={params => (
        <TextField
          {...params}
          label="Item"
          placeholder="Select an item"
          size="small"
          fullWidth
          variant={'standard'}
          margin={'dense'}
        />
      )}
      renderOption={(props, option) => {
        let text = option;
        const percent = items[option];

        if (percent) {
          text += ` (${percent.toFixed(2)}%)`;
        }

        return (
          <Box component={'li'} {...props}>
            <Typography noWrap>{text}</Typography>
          </Box>
        );
      }}
      onChange={(_, value) => {
        onChange(pokemon => {
          pokemon.item = value ?? '';
        });
      }}
      PopperComponent={params => (
        <Popper
          {...params}
          style={{width: 'fit-content'}}
          placement="bottom-start"
        />
      )}
      fullWidth
    />
  );
};
