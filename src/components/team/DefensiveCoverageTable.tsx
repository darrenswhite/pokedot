import React, {useEffect, useState} from 'react';
import {Chip, colors, makeStyles, Paper, Typography} from '@material-ui/core';
import {Icons} from '@pkmn/img';
import {TypeName} from '@pkmn/types';
import {SortableTable, SortableTableRow} from '../common/table/SortableTable';
import {SortableTableHeadCell} from '../common/table/SortableTableHead';
import {PartialPokemonSet, PokeInfo} from '../../info/PokeInfo';

const useStyles = makeStyles(() => ({
  chipValueZero: {
    backgroundColor: colors.green[500],
  },
  chipValueQuarter: {
    backgroundColor: colors.teal[500],
  },
  chipValueHalf: {
    color: colors.green[500],
  },
  chipValueDouble: {
    color: colors.red[500],
  },
  chipValueQuadruple: {
    backgroundColor: colors.red[500],
  },
  totalResistZero: {
    backgroundColor: colors.green[200],
    color: colors.grey[900],
  },
  totalResistOne: {
    backgroundColor: colors.green[400],
    color: colors.grey[900],
  },
  totalResistTwo: {
    backgroundColor: colors.green[600],
    color: colors.grey[900],
    fontWeight: 'bold',
  },
  totalResistThree: {
    backgroundColor: colors.green[800],
    color: colors.grey[100],
    fontWeight: 'bold',
  },
  totalWeakZero: {
    backgroundColor: colors.red[200],
    color: colors.grey[900],
  },
  totalWeakOne: {
    backgroundColor: colors.red[400],
    color: colors.grey[900],
  },
  totalWeakTwo: {
    backgroundColor: colors.red[600],
    color: colors.grey[100],
    fontWeight: 'bold',
  },
  totalWeakThree: {
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

const getTypeResistance = (
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
    case 0.25:
      label = <>&frac14;&times;</>;
      className = classes.chipValueQuarter;
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
    case 4:
      label = <>4&times;</>;
      className = classes.chipValueQuadruple;
      break;
    default:
      throw new Error(`Invalid type resistance value: ${value}.`);
  }

  return label ? (
    <Chip label={label} className={className} size="small" variant="outlined" />
  ) : null;
};

const getTotalResist = (
  value: number,
  classes: ReturnType<typeof useStyles>
): React.ReactNode => {
  let className;

  switch (value) {
    case 0:
      className = classes.totalResistZero;
      break;
    case 1:
      className = classes.totalResistOne;
      break;
    case 2:
      className = classes.totalResistTwo;
      break;
    case 3:
    default:
      className = classes.totalResistThree;
      break;
  }

  return <Paper className={className}>{value}</Paper>;
};

const getTotalWeak = (
  value: number,
  classes: ReturnType<typeof useStyles>
): React.ReactNode => {
  let className;

  switch (value) {
    case 0:
      className = classes.totalWeakZero;
      break;
    case 1:
      className = classes.totalWeakOne;
      break;
    case 2:
      className = classes.totalWeakTwo;
      break;
    case 3:
    default:
      className = classes.totalWeakThree;
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

const scoreResistanceValue = (value: number): number => {
  switch (value) {
    case 0.0:
      return 8;
    case 0.25:
      return 4;
    case 0.5:
      return 2;
    case 1.0:
      return 1;
    case 2.0:
      return -2;
    case 4.0:
      return -4;
    default:
      throw new Error(`Unknown resistance value: ${value}`);
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
      id: 'totalResist',
      label: 'Total Resist',
      align: 'center',
    },
    {
      id: 'totalWeak',
      label: 'Total Weak',
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
  const [infos, setInfos] = useState<PokeInfo[]>([]);
  const [types, setTypes] = useState<TypeName[]>([]);

  useEffect(() => {
    Promise.all(
      pokemonSets.map(pokemon => PokeInfo.forSpecies(pokemon.species))
    ).then(setInfos);
  }, [pokemonSets]);

  useEffect(() => {
    PokeInfo.types().then(setTypes);
  }, []);

  return types.map(type => {
    const typeUrl = Icons.getType(type).url;
    const typeResistances = infos
      .map(info => ({
        [info.species]: info.resistances[type] ?? 1.0,
      }))
      .reduce((prev, curr) => Object.assign(prev, curr), {});
    const totalResist = Object.values(typeResistances).filter(val => val < 1.0)
      .length;
    const totalWeak = Object.values(typeResistances).filter(val => val > 1.0)
      .length;
    const score = Object.values(typeResistances)
      .map(scoreResistanceValue)
      .reduce((prev, curr) => prev + curr, 0);

    return {
      type: {
        value: <img src={typeUrl} />,
        sortValue: type,
      },
      ...Object.fromEntries(
        Object.entries(typeResistances).map(([num, value]) => [
          num,
          {
            value: getTypeResistance(value, classes),
            sortValue: value,
          },
        ])
      ),
      totalResist: {
        value: getTotalResist(totalResist, classes),
        sortValue: totalResist,
      },
      totalWeak: {
        value: getTotalWeak(totalWeak, classes),
        sortValue: totalWeak,
      },
      score: {
        value: getScore(score, classes),
        sortValue: score,
      },
    };
  });
};

export interface DefensiveCoverageTableProps {
  pokemonSets: PartialPokemonSet[];
}

export const DefensiveCoverageTable: React.FC<DefensiveCoverageTableProps> = ({
  pokemonSets,
}: DefensiveCoverageTableProps) => {
  const classes = useStyles();
  const headers = getHeaders(pokemonSets);
  const rows = getRows(pokemonSets, classes);

  return (
    <React.Fragment>
      <Typography variant="h5" component="h2" gutterBottom>
        Defensive Coverage
      </Typography>

      <SortableTable headers={headers} rows={rows} />
    </React.Fragment>
  );
};
