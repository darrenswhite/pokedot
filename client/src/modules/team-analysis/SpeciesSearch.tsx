import {Grid, TextField, Typography} from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  createFilterOptions,
} from '@material-ui/lab';
import {Specie} from '@pkmn/data';
import {findAll} from 'highlight-words-core';
import React, {useContext, useEffect, useRef, useState} from 'react';

import {GenerationContext} from '../generation/GenerationProvider';
import {SpeciesImage, SpeciesImageType} from '../species/SpeciesImage';

const renderOption = (
  option: Specie,
  {inputValue}: AutocompleteRenderOptionState
) => {
  const chunks = findAll({
    searchWords: [inputValue],
    textToHighlight: option.baseSpecies,
  });

  return (
    <Grid container spacing={1} alignItems="center" justify="center">
      <Grid item>
        <SpeciesImage name={option.name} type={SpeciesImageType.ICON} />
      </Grid>

      <Grid item xs>
        <Typography noWrap>
          {chunks.map((chunk, index) => {
            const {end, highlight, start} = chunk;
            const text = option.baseSpecies.substr(start, end - start);

            return (
              <span key={index} style={{fontWeight: highlight ? 700 : 400}}>
                {text}
              </span>
            );
          })}
        </Typography>

        <Typography noWrap variant="subtitle2">
          {option.forme}
        </Typography>
      </Grid>
    </Grid>
  );
};

export interface PokemonSearchProps {
  onChange: (species: string) => void;
}

export const SpeciesSearch: React.FC<PokemonSearchProps> = ({
  onChange,
}: PokemonSearchProps) => {
  const {generation} = useContext(GenerationContext);
  const [species, setSpecies] = useState<Specie[]>([]);
  const [text, setText] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const filterOptions = createFilterOptions<Specie>({
    limit: 5,
    stringify: (option: Specie) => option.name,
  });

  useEffect(() => {
    if (generation) {
      setSpecies(Array.from(generation.species));
    }
  }, [generation]);

  return (
    <Autocomplete
      value={null}
      options={species}
      inputValue={text}
      onInputChange={(_, value) => setText(value)}
      filterOptions={filterOptions}
      getOptionLabel={(option: Specie) => option.name}
      size="small"
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label="Select Pokémon"
          placeholder="Enter name..."
          size="small"
          inputRef={inputRef}
          fullWidth
        />
      )}
      renderOption={renderOption}
      onClose={() => {
        setText('');
      }}
      onChange={(_, value: Specie | null) => {
        if (value) {
          onChange(value.name);
        }
      }}
      fullWidth
    />
  );
};
