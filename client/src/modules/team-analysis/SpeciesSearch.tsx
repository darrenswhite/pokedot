import {Grid, TextField, Typography} from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  createFilterOptions,
} from '@material-ui/lab';
import {findAll} from 'highlight-words-core';
import React, {useEffect, useRef, useState} from 'react';

import {PartialPokemonSet, PokeInfo} from '../../pkmn/PokeInfo';
import {SpeciesImage, SpeciesImageType} from '../species-info/SpeciesImage';

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
  onChange: (pokemonSets: PartialPokemonSet) => void;
}

export const SpeciesSearch: React.FC<PokemonSearchProps> = ({
  onChange,
}: PokemonSearchProps) => {
  const [species, setSpecies] = useState<string[]>([]);
  const [text, setText] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const filterOptions = createFilterOptions<string>({
    limit: 5,
  });

  useEffect(() => {
    PokeInfo.species().then(setSpecies);
  }, []);

  return (
    <Autocomplete
      value={null}
      options={species}
      inputValue={text}
      onInputChange={(_, value) => setText(value)}
      filterOptions={filterOptions}
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
      onChange={(_, value: string | null) => {
        if (value) {
          onChange({
            species: value,
          });
        }
      }}
      fullWidth
    />
  );
};
