import {PokemonSet} from '@pkmn/data';
import {Patch, applyPatches, produce} from 'immer';
import {cloneDeep} from 'lodash/fp';
import {useContext} from 'react';

import {GenerationContext} from '../modules/generation/GenerationProvider';
import {TeamContext} from '../modules/team-analysis/TeamProvider';
import {PartialPokemonSet} from '../pkmn/PartialPokemonSet';

const MAX_CHANGE_HISTORY = 1000;

export interface UseTeamProps {
  team: PokemonSet[];
  setTeam: (team: PartialPokemonSet[]) => void;
  addPokemon: (species: string) => void;
  removePokemon: (index: number) => void;
  updatePokemon: (index: number, recipe: (pokemon: PokemonSet) => void) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  validate: () => Promise<string[] | null>;
}

export const useTeam = (): UseTeamProps => {
  const {format} = useContext(GenerationContext);
  const {team, setTeam, changes, setChanges, currentChange, setCurrentChange} =
    useContext(TeamContext);
  const canUndo = !changes[currentChange];
  const canRedo = !changes[currentChange + 1];

  const setPartialTeam = (parsedTeam: PartialPokemonSet[]) => {
    setTeam(
      produce(
        team,
        draft => {
          draft.splice(0, draft.length);
          draft.push(...parsedTeam.map(createPokemon));
        },
        handleAddChange
      )
    );
  };

  const addPokemon = (species: string) => {
    if (team.length < 6) {
      const pokemon = createPokemon({
        species,
      });

      setTeam(
        produce(
          team,
          draft => {
            draft.push(pokemon);
          },
          handleAddChange
        )
      );
    }
  };

  const removePokemon = (index: number) => {
    setTeam(
      produce(
        team,
        draft => {
          draft.splice(index, 1);
        },
        handleAddChange
      )
    );
  };

  const updatePokemon = (
    index: number,
    recipe: (pokemon: PokemonSet) => void
  ) => {
    setTeam(
      produce(
        team,
        draft => {
          const pokemon = draft[index];

          if (pokemon) {
            recipe(pokemon);
          }
        },
        handleAddChange
      )
    );
  };

  const handleAddChange = (patches: Patch[], inversePatches: Patch[]) => {
    setChanges(
      produce(changes, draft => {
        draft[currentChange + 1] = {
          patches,
          inversePatches,
        };

        delete draft[currentChange + 2];
        delete draft[currentChange + 1 - MAX_CHANGE_HISTORY];
      })
    );
    setCurrentChange(currentChange + 1);
  };

  const undo = () => {
    const change = changes[currentChange];

    if (change) {
      setTeam(applyPatches(team, change.inversePatches));
      setCurrentChange(currentChange - 1);
    }
  };

  const redo = () => {
    const change = changes[currentChange + 1];

    if (change) {
      setTeam(applyPatches(team, change.patches));
      setCurrentChange(currentChange + 1);
    }
  };

  const validate = async (): Promise<string[] | null> => {
    const {TeamValidator} = await import('@pkmn/sim/build/cjs/sim');
    const validator = new TeamValidator(format[0]);

    return validator.validateTeam(cloneDeep(team));
  };

  return {
    team,
    setTeam: setPartialTeam,
    addPokemon,
    removePokemon,
    updatePokemon,
    undo,
    redo,
    canUndo,
    canRedo,
    validate,
  };
};

const createPokemon = (pokemon: PartialPokemonSet): PokemonSet => {
  return {
    name: pokemon.name ?? '',
    species: pokemon.species,
    item: pokemon.item ?? '',
    ability: pokemon.ability ?? '',
    moves: pokemon.moves
      ? [
          pokemon.moves[0] ?? '',
          pokemon.moves[1] ?? '',
          pokemon.moves[2] ?? '',
          pokemon.moves[3] ?? '',
        ]
      : ['', '', '', ''],
    nature: pokemon.nature ?? '',
    gender: pokemon.gender ?? '',
    evs: pokemon.evs
      ? {
          hp: pokemon.evs.hp ?? 0,
          atk: pokemon.evs.atk ?? 0,
          def: pokemon.evs.def ?? 0,
          spa: pokemon.evs.spa ?? 0,
          spd: pokemon.evs.spd ?? 0,
          spe: pokemon.evs.spe ?? 0,
        }
      : {
          hp: 0,
          atk: 0,
          def: 0,
          spa: 0,
          spd: 0,
          spe: 0,
        },
    ivs: pokemon.ivs
      ? {
          hp: pokemon.ivs.hp ?? 31,
          atk: pokemon.ivs.atk ?? 31,
          def: pokemon.ivs.def ?? 31,
          spa: pokemon.ivs.spa ?? 31,
          spd: pokemon.ivs.spd ?? 31,
          spe: pokemon.ivs.spe ?? 31,
        }
      : {
          hp: 31,
          atk: 31,
          def: 31,
          spa: 31,
          spd: 31,
          spe: 31,
        },
    level: pokemon.level ?? 100,
    shiny: pokemon.shiny ?? false,
    happiness: pokemon.happiness ?? 255,
    pokeball: pokemon.pokeball ?? '',
    hpType: pokemon.hpType ?? '',
    gigantamax: pokemon.gigantamax ?? false,
  };
};
