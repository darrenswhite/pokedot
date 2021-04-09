import {Popper, TextField, Typography} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {PokemonSet} from '@pkmn/data';
import React, {useContext, useEffect, useState} from 'react';

import {useSpecie} from '../../hooks/useSpecies';
import {GenerationContext} from '../generation/GenerationProvider';

import {PokemonAction, PokemonActionType} from './PokemonCard';

export interface PokemonAbilityInputProps {
  pokemon: PokemonSet;
  dispatch: React.Dispatch<PokemonAction>;
}

export const PokemonAbilityInput: React.FC<PokemonAbilityInputProps> = ({
  pokemon,
  dispatch,
}: PokemonAbilityInputProps) => {
  const {generation, stats} = useContext(GenerationContext);
  const specie = useSpecie(pokemon.species);
  const [abilities, setAbilities] = useState<Record<string, number>>({});
  const options = Object.entries(abilities)
    .sort((left, right) => right[1] - left[1])
    .map(entry => entry[0]);
  const ability = pokemon.ability;
  const nullableAbility = ability && ability.length > 0 ? ability : null;

  useEffect(() => {
    if (generation && specie) {
      const specieStats = stats.data[specie.name];
      const abilityStats = specieStats?.Abilities || {};
      const total = Object.values(abilityStats).reduce(
        (total, curr) => total + curr,
        0
      );

      const abilities = Object.fromEntries(
        Object.values(specie.abilities).map(name => {
          const ability = generation.abilities.get(name);
          const usage = (ability && abilityStats[ability.id]) ?? 0;

          return [name, (usage / total) * 100];
        })
      );

      setAbilities(abilities);
    }
  }, [generation, specie, stats]);

  return (
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
      renderOption={option => {
        let text = option;
        const percent = abilities[option];

        if (percent) {
          text += ` (${percent.toFixed(2)}%)`;
        }

        return <Typography noWrap>{text}</Typography>;
      }}
      onChange={(_, value) =>
        dispatch({
          type: PokemonActionType.SET_ABILITY,
          ability: value ?? '',
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
