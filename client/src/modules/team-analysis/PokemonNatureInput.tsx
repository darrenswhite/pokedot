import {Popper, TextField} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {Nature, PokemonSet} from '@pkmn/data';
import React, {useContext, useEffect, useState} from 'react';

import {useSpecie} from '../../hooks/useSpecies';
import {GenerationContext} from '../generation/GenerationProvider';

import {PokemonAction, PokemonActionType} from './PokemonCard';

export interface PokemonNatureInputProps {
  pokemon: PokemonSet;
  dispatch: React.Dispatch<PokemonAction>;
}

export const PokemonNatureInput: React.FC<PokemonNatureInputProps> = ({
  pokemon,
  dispatch,
}: PokemonNatureInputProps) => {
  const {generation} = useContext(GenerationContext);
  const specie = useSpecie(pokemon.species);
  const [natures, setNatures] = useState<Nature[]>([]);
  const options = natures.map(nature => nature.name);
  const nature = pokemon.nature;
  const nullableNature = nature && nature.length > 0 ? nature : null;

  useEffect(() => {
    if (generation && specie) {
      setNatures(Array.from(generation.natures));
    }
  }, [generation, specie]);

  return (
    <Autocomplete
      options={options}
      value={nullableNature}
      size="small"
      renderInput={params => (
        <TextField
          {...params}
          label="Nature"
          placeholder="Select a nature"
          size="small"
          fullWidth
        />
      )}
      getOptionLabel={option => {
        let text = option;

        if (generation) {
          const nature = generation.natures.get(option);

          if (nature && nature.plus && nature.minus) {
            text += ` (+${generation.stats.display(
              nature.plus
            )}/-${generation.stats.display(nature.minus)})`;
          }
        }

        return text;
      }}
      onChange={(_, value) =>
        dispatch({
          type: PokemonActionType.SET_NATURE,
          nature: value ?? '',
        })
      }
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
