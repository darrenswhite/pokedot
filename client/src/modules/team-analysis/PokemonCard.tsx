import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  TextField,
} from '@material-ui/core';
import {Autocomplete, createFilterOptions} from '@material-ui/lab';
import {clone, range} from 'lodash/fp';
import React, {useEffect, useState} from 'react';

import {PartialPokemonSet, PokeInfo} from '../../pkmn/PokeInfo';
import {SpeciesImage, SpeciesImageType} from '../species-info/SpeciesImage';

const renderMoveInput = (
  pokemon: PartialPokemonSet,
  info: PokeInfo,
  index: number,
  onUpdate: (pokemon: PartialPokemonSet) => void
) => {
  const moves = pokemon.moves ?? [];
  const filterOptions = createFilterOptions<string>({
    limit: 5,
  });
  const options = info.moves.map(move => move.name);
  const move = moves[index];
  const nullableMove = move && move.length > 0 ? moves[index] : null;

  return (
    <Autocomplete
      options={options}
      value={nullableMove}
      filterOptions={filterOptions}
      size="small"
      renderInput={params => (
        <TextField
          {...params}
          variant="outlined"
          label={`Move #${index + 1}`}
          placeholder="Select a move"
          size="small"
        />
      )}
      onChange={(_, value: string | null) => {
        const newMoves = clone(moves);

        newMoves[index] = value ?? '';

        onUpdate({
          ...pokemon,
          moves: newMoves,
        });
      }}
    />
  );
};

export interface PokemonCardProps {
  pokemon: PartialPokemonSet;
  onRemove: () => void;
  onUpdate: (pokemon: PartialPokemonSet) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onRemove,
  onUpdate,
}: PokemonCardProps) => {
  const [info, setInfo] = useState<PokeInfo | null>(null);
  let content;

  useEffect(() => {
    PokeInfo.forPokemonSet(pokemon).then(info => setInfo(info));
  }, [pokemon]);

  if (info) {
    content = (
      <Card>
        <CardHeader title={info.species} />

        <CardActionArea>
          <CardMedia>
            <SpeciesImage
              name={info.species}
              type={SpeciesImageType.SPRITE}
              moreInfo
            />
          </CardMedia>
        </CardActionArea>

        <CardContent>
          <Grid container spacing={1}>
            {range(0, 4).map(index => (
              <Grid key={index} item xs={6}>
                {renderMoveInput(pokemon, info, index, onUpdate)}
              </Grid>
            ))}
          </Grid>
        </CardContent>

        <CardActions>
          <Button size="small" color="primary" onClick={onRemove}>
            Remove
          </Button>
        </CardActions>
      </Card>
    );
  } else {
    content = <span />;
  }

  return content;
};
