import React from 'react';
import {TextField} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {PartialPokemonSet, PokeInfo} from '../../info/PokeInfo';

export interface SpeciesSearchProps {
  onSelect: (pokemonSets: PartialPokemonSet[]) => void;
}

const options = PokeInfo.names();

export const SpeciesSearch: React.FC<SpeciesSearchProps> = ({
  onSelect,
}: SpeciesSearchProps) => {
  return (
    <Autocomplete
      options={options}
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
