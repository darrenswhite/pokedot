import React, {useEffect, useState} from 'react';
import {TextField} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {PartialPokemonSet, PokeInfo} from '../../info/PokeInfo';

export interface SpeciesSearchProps {
  onSelect: (pokemonSets: PartialPokemonSet[]) => void;
}

export const SpeciesSearch: React.FC<SpeciesSearchProps> = ({
  onSelect,
}: SpeciesSearchProps) => {
  const [species, setSpecies] = useState<string[]>([]);

  useEffect(() => {
    PokeInfo.species().then(setSpecies);
  }, []);

  return (
    <Autocomplete
      options={species}
      size="small"
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="Select species"
          placeholder="Enter species name..."
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
