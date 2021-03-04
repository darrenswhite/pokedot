import React from 'react';
import {
  Chip,
  Container,
  Paper,
  Typography,
  colors,
  makeStyles,
} from '@material-ui/core';
import {Icons} from '@pkmn/img';
import {
  SortableTable,
  SortableTableRow,
} from 'src/components/common/table/SortableTable';
import {SortableTableHeadCell} from 'src/components/common/table/SortableTableHead';
import {PokeInfo} from 'src/info/PokeInfo';
import {TeamInfo} from 'src/info/TeamInfo';

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

const getHeaders = (teamInfo: TeamInfo): SortableTableHeadCell[] => {
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
  ];

  return [typeHeader]
    .concat(
      teamInfo.pokeInfo.map(info => ({
        id: info.num,
        label: info.name,
        align: 'center',
        before: <span style={Icons.getPokemon(info.name).css} />,
      }))
    )
    .concat(totalHeaders);
};

const getRows = (
  teamInfo: TeamInfo,
  classes: ReturnType<typeof useStyles>
): SortableTableRow[] => {
  return PokeInfo.types().map(type => {
    const typeName = type.name;
    const typeUrl = Icons.getType(typeName).url;
    const typeResistances = teamInfo.pokeInfo
      .map(info => ({
        [info.num]: info.resistances[typeName] ?? 1,
      }))
      .reduce((prev, curr) => Object.assign(prev, curr), {});
    const totalResist = Object.values(typeResistances).filter(val => val < 1)
      .length;
    const totalWeak = Object.values(typeResistances).filter(val => val > 1)
      .length;

    return {
      type: {
        value: <img src={typeUrl} />,
        sortValue: typeName,
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
    };
  });
};

export interface TypeResistanceTableProps {
  teamInfo: TeamInfo;
}

export const TypeResistanceTable: React.FC<TypeResistanceTableProps> = ({
  teamInfo,
}: TypeResistanceTableProps) => {
  const classes = useStyles();
  const headers = getHeaders(teamInfo);
  const rows = getRows(teamInfo, classes);

  return (
    <Container>
      <Typography variant="h5" component="h2" gutterBottom>
        Resistance Chart
      </Typography>

      <SortableTable headers={headers} rows={rows} />
    </Container>
  );
};
