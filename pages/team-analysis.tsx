import React, {FC} from 'react';
import {Container} from '@material-ui/core';
import {ResultsTable, ResultsTableHeader} from '../src/ResultsTable';

const rows = [
  {
    type: 'Bug',
    '0.0': 0,
    '0.25': 1,
    '0.5': 4,
    '1.0': 1,
    '2.0': 0,
    '4.0': 0,
    score: 13,
  },
  {
    type: 'Dark',
    '0.0': 0,
    '0.25': 0,
    '0.5': 3,
    '1.0': 3,
    '2.0': 0,
    '4.0': 0,
    score: 9,
  },
];

const headers: ResultsTableHeader[] = [
  {
    id: 'type',
    numeric: false,
    label: 'Type',
  },
  {
    id: '0.0',
    numeric: true,
    label: '0x',
    align: 'right',
  },
  {
    id: '0.25',
    numeric: true,
    label: '1/4x',
    align: 'right',
  },
  {
    id: '0.5',
    numeric: true,
    label: '1/2x',
    align: 'right',
  },
  {
    id: '1.0',
    numeric: true,
    label: '1x',
    align: 'right',
  },
  {
    id: '2.0',
    numeric: true,
    label: '2x',
    align: 'right',
  },
  {
    id: '4.0',
    numeric: true,
    label: '4x',
    align: 'right',
  },
  {
    id: 'score',
    numeric: true,
    label: 'Score',
    align: 'right',
  },
];

const TeamAnalysis: FC = () => {
  return (
    <Container>
      <ResultsTable headers={headers} rows={rows} />
    </Container>
  );
};

export default TeamAnalysis;
