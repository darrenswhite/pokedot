import {Grid, Typography} from '@material-ui/core';
import React, {ReactElement, useContext} from 'react';

import {
  GeneratedTeamsMatrix,
  GeneratedTeamsMatrixProps,
} from '../../pkmn/matrix/GeneratedTeamsMatrix2';
import {SpeciesImage, SpeciesImageType} from '../pokemon-info/SpeciesImage';
import {PCol} from '../table/model/PCol';
import {PValue} from '../table/model/PRow';
import {PMatrixTable} from '../table/PMatrixTable';

import {RoomContext} from './RoomProvider';
import {TeamGeneratorContainer} from './TeamGeneratorContainer';

const renderPoolCell = (value: PValue): ReactElement => {
  return <span>#{Number(value) + 1}</span>;
};

const renderSpeciesCell = (value: PValue): ReactElement => {
  return (
    <SpeciesImage
      name={value as string}
      type={SpeciesImageType.ICON}
      moreInfo
      showTooltip
    />
  );
};

const mapSpeciesValue = (value: PValue): PValue => {
  const entry = (value as GeneratedTeamsMatrixProps[])[0];

  return entry ? entry.pokemon.name : '';
};

export const Summary: React.FC = () => {
  const {state} = useContext(RoomContext);
  const matrix = GeneratedTeamsMatrix.forState(state);

  const columnFieldOverrides: Partial<PCol> = {
    headerName: 'Pool',
    renderCell: renderPoolCell,
  };

  const idFieldOverrides: Partial<PCol> = {
    renderCell: renderSpeciesCell,
    mapValue: mapSpeciesValue,
  };

  return (
    <TeamGeneratorContainer
      header={
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Summary
        </Typography>
      }
    >
      <Grid container justify="center">
        <Grid item xs={12} sm={12} md={8} lg={6} xl={4}>
          <PMatrixTable
            matrix={matrix}
            columnField="pool"
            idField="playerName"
            valueField="pokemon"
            columnFieldOverrides={columnFieldOverrides}
            idFieldOverrides={idFieldOverrides}
          />
        </Grid>
      </Grid>
    </TeamGeneratorContainer>
  );
};
