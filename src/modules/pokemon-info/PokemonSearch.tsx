import React, {useEffect, useState} from 'react';
import {TextField} from '@material-ui/core';
import {Autocomplete, createFilterOptions} from '@material-ui/lab';
import {PartialPokemonSet, PokeInfo} from '../../pkmn/PokeInfo';

export interface PokemonSearchProps {
  onSelect: (pokemonSets: PartialPokemonSet[]) => void;
}

export const PokemonSearch: React.FC<PokemonSearchProps> = ({
  onSelect,
}: PokemonSearchProps) => {
  const [species, setSpecies] = useState<string[]>([]);
  const filterOptions = createFilterOptions<string>({
    limit: 5,
  });

  useEffect(() => {
    PokeInfo.species().then(setSpecies);
  }, []);

  return (
    <Autocomplete
      options={species}
      filterOptions={filterOptions}
      size="small"
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="Select Pokémon"
          placeholder="Enter name..."
          size="small"
        />
      )}
      onChange={(_, values: string[]) => {
        onSelect(
          values.map(value => ({
            species: value,
          }))
        );
      }}
      limitTags={3}
      multiple
      disableCloseOnSelect
    />
  );
};
