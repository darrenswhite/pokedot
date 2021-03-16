import React from 'react';
import {Chip, colors, makeStyles, Paper, Typography} from '@material-ui/core';
import {Icons} from '@pkmn/img';
import {SortableTable, SortableTableRow} from '../common/table/SortableTable';
import {SortableTableHeadCell} from '../common/table/SortableTableHead';
import {PartialPokemonSet, PokeInfo} from '../../info/PokeInfo';

const useStyles = makeStyles(() => ({
  chipValueZero: {
    backgroundColor: colors.red[500],
  },
  chipValueHalf: {
    color: colors.red[500],
  },
  chipValueDouble: {
    color: colors.green[500],
  },
  totalSuperEffectiveZero: {
    backgroundColor: colors.green[200],
    color: colors.grey[900],
  },
  totalSuperEffectiveOne: {
    backgroundColor: colors.green[400],
    color: colors.grey[900],
  },
  totalSuperEffectiveTwo: {
    backgroundColor: colors.green[600],
    color: colors.grey[900],
    fontWeight: 'bold',
  },
  totalSuperEffectiveThree: {
    backgroundColor: colors.green[800],
    color: colors.grey[100],
    fontWeight: 'bold',
  },
  totalIneffectiveZero: {
    backgroundColor: colors.red[200],
    color: colors.grey[900],
  },
  totalIneffectiveOne: {
    backgroundColor: colors.red[400],
    color: colors.grey[900],
  },
  totalIneffectiveTwo: {
    backgroundColor: colors.red[600],
    color: colors.grey[100],
    fontWeight: 'bold',
  },
  totalIneffectiveThree: {
    backgroundColor: colors.red[800],
    color: colors.grey[100],
    fontWeight: 'bold',
  },
  scoreNegative: {
    backgroundColor: colors.grey[900],
    color: colors.grey[100],
    fontWeight: 'bold',
  },
  scoreLow: {
    backgroundColor: colors.red[900],
    color: colors.grey[100],
  },
  scoreMedium: {
    backgroundColor: colors.amber[900],
    color: colors.grey[100],
  },
  scoreHigh: {
    backgroundColor: colors.green[900],
    color: colors.grey[100],
  },
}));

const getTypeCoverage = (
  value: number,
  classes: ReturnType<typeof useStyles>
): React.ReactNode => {
  let label;
  let className;

  switch (value) {
    case 0.0:
      label = <>0&times;</>;
      className = classes.chipValueZero;
      break;
    case 0.5:
      label = <>&frac12;&times;</>;
      className = classes.chipValueHalf;
      break;
    case 1:
      break;
    case 2:
      label = <>2&times;</>;
      className = classes.chipValueDouble;
      break;
    default:
      throw new Error(`Invalid type coverage value: ${value}.`);
  }

  return label ? (
    <Chip label={label} className={className} size="small" variant="outlined" />
  ) : null;
};

const getTotalSuperEffective = (
  value: number,
  classes: ReturnType<typeof useStyles>
): React.ReactNode => {
  let className;

  switch (value) {
    case 0:
      className = classes.totalSuperEffectiveZero;
      break;
    case 1:
      className = classes.totalSuperEffectiveOne;
      break;
    case 2:
      className = classes.totalSuperEffectiveTwo;
      break;
    case 3:
    default:
      className = classes.totalSuperEffectiveThree;
      break;
  }

  return <Paper className={className}>{value}</Paper>;
};

const getTotalIneffective = (
  value: number,
  classes: ReturnType<typeof useStyles>
): React.ReactNode => {
  let className;

  switch (value) {
    case 0:
      className = classes.totalIneffectiveZero;
      break;
    case 1:
      className = classes.totalIneffectiveOne;
      break;
    case 2:
      className = classes.totalIneffectiveTwo;
      break;
    case 3:
    default:
      className = classes.totalIneffectiveThree;
      break;
  }

  return <Paper className={className}>{value}</Paper>;
};

const getScore = (
  value: number,
  classes: ReturnType<typeof useStyles>
): React.ReactNode => {
  let className;

  if (value < 0) {
    className = classes.scoreNegative;
  } else if (value >= 0 && value < 5) {
    className = classes.scoreLow;
  } else if (value >= 5 && value < 10) {
    className = classes.scoreMedium;
  } else if (value >= 10) {
    className = classes.scoreHigh;
  }

  return <Paper className={className}>{value}</Paper>;
};

const scoreCoverageValue = (value: number): number => {
  switch (value) {
    case 0.0:
      return -4;
    case 0.25:
      return -2;
    case 0.5:
      return -1;
    case 1.0:
      return 1;
    case 2.0:
      return 2;
    default:
      throw new Error(`Unknown coverage value: ${value}`);
  }
};

const getHeaders = (
  pokemonSets: PartialPokemonSet[]
): SortableTableHeadCell[] => {
  const typeHeader: SortableTableHeadCell = {
    id: 'type',
    label: 'Type',
    align: 'left',
  };
  const totalHeaders: SortableTableHeadCell[] = [
    {
      id: 'totalSuperEffective',
      label: 'Total Super Effective',
      align: 'center',
    },
    {
      id: 'totalIneffective',
      label: 'Total Ineffective',
      align: 'center',
    },
    {
      id: 'score',
      label: 'Score',
      align: 'center',
    },
  ];

  return [typeHeader]
    .concat(
      pokemonSets.map(pokemon => ({
        id: pokemon.species,
        label: pokemon.species,
        align: 'center',
        before: <span style={Icons.getPokemon(pokemon.species).css} />,
      }))
    )
    .concat(totalHeaders);
};

const getRows = (
  pokemonSets: PartialPokemonSet[],
  classes: ReturnType<typeof useStyles>
): SortableTableRow[] => {
  return PokeInfo.types().map(type => {
    const typeName = type.name;
    const typeUrl = Icons.getType(typeName).url;
    const typeCoverages = pokemonSets
      .map(pokemon => ({
        [pokemon.species]:
          (pokemon.moves &&
            PokeInfo.forSpecies(pokemon.species).coverage(pokemon.moves)[
              typeName
            ]) ??
          1.0,
      }))
      .reduce((prev, curr) => Object.assign(prev, curr), {});
    const totalSuperEffective = Object.values(typeCoverages).filter(
      val => val > 1
    ).length;
    const totalIneffective = Object.values(typeCoverages).filter(
      val => val < 1.0
    ).length;
    const score = Object.values(typeCoverages)
      .map(scoreCoverageValue)
      .reduce((prev, curr) => prev + curr, 0);

    return {
      type: {
        value: <img src={typeUrl} />,
        sortValue: typeName,
      },
      ...Object.fromEntries(
        Object.entries(typeCoverages).map(([num, value]) => [
          num,
          {
            value: getTypeCoverage(value, classes),
            sortValue: value,
          },
        ])
      ),
      totalSuperEffective: {
        value: getTotalSuperEffective(totalSuperEffective, classes),
        sortValue: totalSuperEffective,
      },
      totalIneffective: {
        value: getTotalIneffective(totalIneffective, classes),
        sortValue: totalIneffective,
      },
      score: {
        value: getScore(score, classes),
        sortValue: score,
      },
    };
  });
};

export interface OffensiveCoverageTableProps {
  pokemonSets: PartialPokemonSet[];
}

export const OffensiveCoverageTable: React.FC<OffensiveCoverageTableProps> = ({
  pokemonSets,
}: OffensiveCoverageTableProps) => {
  const classes = useStyles();
  const headers = getHeaders(pokemonSets);
  const rows = getRows(pokemonSets, classes);

  return (
    <React.Fragment>
      <Typography variant="h5" component="h2" gutterBottom>
        Offensive Coverage
      </Typography>

      <SortableTable headers={headers} rows={rows} />
    </React.Fragment>
  );
};
