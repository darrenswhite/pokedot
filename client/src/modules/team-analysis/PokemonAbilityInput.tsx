import {Box, TextField} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {PokemonSet} from '@pkmn/data';
import React, {useEffect, useState} from 'react';

import {useSpecie} from '../../hooks/useSpecies';

import {PokemonAction, PokemonActionType} from './PokemonCard';

export interface PokemonAbilityInputProps {
  pokemon: PokemonSet;
  dispatch: React.Dispatch<PokemonAction>;
}

export const PokemonAbilityInput: React.FC<PokemonAbilityInputProps> = ({
  pokemon,
  dispatch,
}: PokemonAbilityInputProps) => {
  const specie = useSpecie(pokemon.species);
  const [options, setOptions] = useState<string[]>([]);
  const nullableAbility =
    pokemon.ability && pokemon.ability.length > 0 ? pokemon.ability : null;

  useEffect(() => {
    if (specie) {
      setOptions(Object.values(specie.abilities));
    }
  }, [specie]);

  return (
    <Box width="150px">
      <Autocomplete
        options={options}
        value={nullableAbility}
        size="small"
        renderInput={params => (
          <TextField
            {...params}
            label="Ability"
            placeholder="Select an ability"
            size="small"
            fullWidth
          />
        )}
        onChange={(_, value) =>
          dispatch({
            type: PokemonActionType.SET_ABILITY,
            ability: value ?? '',
          })
        }
        fullWidth
      />
    </Box>
  );
};
