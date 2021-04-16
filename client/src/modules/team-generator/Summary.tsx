import {Button, Grid, Typography} from '@material-ui/core';
import {BarChart} from '@material-ui/icons';
import {useRouter} from 'next/router';
import React, {ReactElement, useContext} from 'react';

import {useTeam} from '../../hooks/useTeam';
import {
  GeneratedTeamsMatrix,
  GeneratedTeamsMatrixProps,
} from '../../pkmn/matrix/GeneratedTeamsMatrix';
import {Routes} from '../../router/Routes';
import {SpeciesImage, SpeciesImageType} from '../species-info/SpeciesImage';
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
  const router = useRouter();
  const {setTeam} = useTeam();
  const {room, state} = useContext(RoomContext);
  const matrix = GeneratedTeamsMatrix.forState(state);

  const columnFieldOverrides: Partial<PCol> = {
    headerName: 'Pool',
    renderCell: renderPoolCell,
  };

  const idFieldOverrides: Partial<PCol> = {
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
    <TeamGeneratorContainer
      header={
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Summary
        </Typography>
      }
    >
      <Grid container justify="center" spacing={4}>
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

        <Grid container item xs={12} justify="center">
          <Grid item>
            <Button variant="contained" onClick={viewTeam} color="primary">
              <BarChart />
              View Team Analysis
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </TeamGeneratorContainer>
  );
};
