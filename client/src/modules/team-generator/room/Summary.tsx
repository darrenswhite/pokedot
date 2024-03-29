import {BarChart} from '@mui/icons-material';
import {Button, Grid, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import React, {ReactElement, useContext} from 'react';

import {useTeam} from '../../../hooks/useTeam';
import {
  GeneratedTeamsMatrix,
  GeneratedTeamsMatrixProps,
} from '../../../pkmn/matrix/GeneratedTeamsMatrix';
import {Routes} from '../../../router/Routes';
import {SpeciesImage, SpeciesImageType} from '../../species/SpeciesImage';
import {PCol} from '../../table/model/PCol';
import {PValue} from '../../table/model/PRow';
import {PMatrixTable} from '../../table/PMatrixTable';
import {TeamGeneratorContext} from '../TeamGeneratorProvider';

import {RoomLayout} from './RoomLayout';

const renderPoolCell = (value: PValue): ReactElement => {
  return <span>#{Number(value) + 1}</span>;
};

const renderSpeciesCell = (value: PValue): ReactElement => {
  return (
    <SpeciesImage
      name={value as string}
      type={SpeciesImageType.SPRITE}
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
  const router = useRouter();
  const {setTeam} = useTeam();
  const {room, state} = useContext(TeamGeneratorContext);
  const matrix = GeneratedTeamsMatrix.forState(state);

  const columnFieldOverrides: Partial<PCol> = {
    headerName: 'Name',
  };

  const idFieldOverrides: Partial<PCol> = {
    renderHeader: renderPoolCell,
    renderCell: renderSpeciesCell,
    mapValue: mapSpeciesValue,
  };

  const viewTeam = () => {
    const player = state.players[room.sessionId];

    if (player) {
      setTeam(
        player.team.map(pokemon => ({
          species: pokemon.name,
        }))
      );

      router.push(Routes.TEAM_ANALYSIS.path).catch(e => {
        console.log(`Failed to navigate to team analysis page.`, e);
      });
    }
  };

  return (
    <RoomLayout
      header={
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Summary
        </Typography>
      }
    >
      <Grid container justifyContent="center" spacing={4}>
        <Grid item style={{maxWidth: '100vw'}}>
          <PMatrixTable
            matrix={matrix}
            columnField="playerName"
            idField="pool"
            valueField="pokemon"
            columnFieldOverrides={columnFieldOverrides}
            idFieldOverrides={idFieldOverrides}
          />
        </Grid>

        <Grid container item xs={12} justifyContent="center">
          <Grid item>
            <Button variant="contained" onClick={viewTeam} color="primary">
              <BarChart />
              Import To Team Analysis
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </RoomLayout>
  );
};
