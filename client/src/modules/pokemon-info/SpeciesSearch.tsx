import {Grid, TextField, Typography} from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  createFilterOptions,
} from '@material-ui/lab';
import {findAll} from 'highlight-words-core';
import React, {useEffect, useState} from 'react';

import {PartialPokemonSet, PokeInfo} from '../../pkmn/PokeInfo';

import {SpeciesImage, SpeciesImageType} from './SpeciesImage';

const renderOption = (
  option: string,
  {inputValue}: AutocompleteRenderOptionState
) => {
  const chunks = findAll({
    searchWords: [inputValue],
    textToHighlight: option,
  });

  return (
    <Grid container spacing={1} alignItems="center" justify="center">
      <Grid item>
        <SpeciesImage name={option} type={SpeciesImageType.ICON} />
      </Grid>

      <Grid item xs>
        <Typography noWrap>
          {chunks.map((chunk, index) => {
            const {end, highlight, start} = chunk;
            const text = option.substr(start, end - start);

            return (
              <span key={index} style={{fontWeight: highlight ? 700 : 400}}>
                {text}
              </span>
            );
          })}
        </Typography>
      </Grid>
    </Grid>
  );
};

export interface PokemonSearchProps {
  onSelect: (pokemonSets: PartialPokemonSet[]) => void;
}

export const SpeciesSearch: React.FC<PokemonSearchProps> = ({
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
      renderOption={renderOption}
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
