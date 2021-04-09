import {Button, Card, CardContent, CardHeader, Grid} from '@material-ui/core';
import {ArrowBack, ArrowForward} from '@material-ui/icons';
import {PokemonSet} from '@pkmn/types';
import {Patch, applyPatches, produce} from 'immer';
import dynamic from 'next/dynamic';
import React, {useContext, useState} from 'react';

import {PartialPokemonSet} from '../../pkmn/PartialPokemonSet';
import {DefensiveTableProps} from '../coverage/DefensiveTable';
import {OffensiveTableProps} from '../coverage/OffensiveTable';
import {SummaryCardProps} from '../coverage/SummaryCard';

import {PokemonCardProps} from './PokemonCard';
import {SpeciesSearch} from './SpeciesSearch';
import {TeamParser} from './TeamParser';
import {TeamContext} from './TeamProvider';

const PokemonCard = dynamic<PokemonCardProps>(() =>
  import('./PokemonCard').then(m => m.PokemonCard)
);

const DefensiveTable = dynamic<DefensiveTableProps>(() =>
  import('../coverage/DefensiveTable').then(m => m.DefensiveTable)
);

const OffensiveTable = dynamic<OffensiveTableProps>(() =>
  import('../coverage/OffensiveTable').then(m => m.OffensiveTable)
);

const SummaryCard = dynamic<SummaryCardProps>(() =>
  import('../coverage/SummaryCard').then(m => m.SummaryCard)
);

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
    level: pokemon.level ?? 50,
    shiny: pokemon.shiny ?? false,
    happiness: pokemon.happiness ?? 255,
    pokeball: pokemon.pokeball ?? '',
    hpType: pokemon.hpType ?? '',
    gigantamax: pokemon.gigantamax ?? false,
  };
};

const MAX_CHANGE_HISTORY = 1000;

interface Change {
  patches: Patch[];
  inversePatches: Patch[];
}

const TeamAnalysis: React.FC = () => {
  const {team, setTeam} = useContext(TeamContext);
  const [currentChange, setCurrentChange] = useState<number>(-1);
  const [changes, setChanges] = useState<Record<number, Change>>({});

  const setParsedTeam = (parsedTeam: PartialPokemonSet[]) => {
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

  const handleUndo = () => {
    const change = changes[currentChange];

    if (change) {
      setTeam(applyPatches(team, change.inversePatches));
      setCurrentChange(currentChange - 1);
    }
  };

  const handleRedo = () => {
    const change = changes[currentChange + 1];

    if (change) {
      setTeam(applyPatches(team, change.patches));
      setCurrentChange(currentChange + 1);
    }
  };

  return (
    <Grid container justify="center" spacing={2}>
      <Grid item>
        <TeamParser value={team} onParse={setParsedTeam} />
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          onClick={handleUndo}
          color="primary"
          disabled={!changes[currentChange]}
          aria-label="undo"
          fullWidth
        >
          <ArrowBack />
        </Button>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          onClick={handleRedo}
          color="primary"
          disabled={!changes[currentChange + 1]}
          aria-label="redo"
          fullWidth
        >
          <ArrowForward />
        </Button>
      </Grid>

      <Grid container item xs={12} justify="center">
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <SpeciesSearch onChange={addPokemon} />
        </Grid>
      </Grid>

      {team.length === 0 && (
        <Grid container item xs={12} justify="center">
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card>
              <CardHeader title="No Pokémon added." />

              <CardContent>
                To start, use the search above to find a Pokémon to add to your
                team, or import a team from Pokémon Showdown Teambuilder.
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {team.length > 0 && (
        <Grid container item xs={12} justify="center" spacing={4}>
          {team.map((pokemon, index) => (
            <Grid key={index} item>
              <PokemonCard
                pokemon={pokemon}
                onChange={recipe => updatePokemon(index, recipe)}
                onRemove={() => removePokemon(index)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {team.length > 0 && (
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={8}
          lg={6}
          xl={4}
          justify="center"
          spacing={4}
        >
          <Grid item xs={12}>
            <DefensiveTable
              pokemonSets={team}
              columnField="species"
              idField="effectiveness"
              valueField="type"
            />
          </Grid>

          <Grid item xs={12}>
            <OffensiveTable
              pokemonSets={team}
              columnField="species"
              idField="effectiveness"
              valueField="type"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <SummaryCard pokemonSets={team} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default TeamAnalysis;
