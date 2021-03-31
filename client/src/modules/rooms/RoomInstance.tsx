import {Button, Grid, Typography} from '@material-ui/core';
import {Room} from 'colyseus.js';
import {every, map, min} from 'lodash/fp';
import React from 'react';

import {PlayerList} from './PlayerList';
import {PlayerName} from './PlayerName';
import {RoomOptionsList} from './RoomOptionsList';
import {
  Player,
  Pokemon,
  TeamGeneratorOptions,
  TeamGeneratorState,
} from './TeamGeneratorState';

interface RoomContentContainerProps {
  children: NonNullable<React.ReactNode>;
  header?: React.ReactNode;
  players: Player[];
  options: TeamGeneratorOptions;
  currentPool: number;
}

const RoomContentContainer: React.FC<RoomContentContainerProps> = ({
  children,
  header,
  players,
  options,
  currentPool,
}: RoomContentContainerProps) => {
  return (
    <Grid container style={{height: '100%'}}>
      <Grid container item xs={12} sm={10} justify="center">
        <Grid item xs>
          {header}
        </Grid>

        <Grid
          container
          item
          xs={12}
          alignContent="center"
          justify="center"
          style={{height: '100%'}}
        >
          <Grid item xs>
            {children}
          </Grid>
        </Grid>
      </Grid>

      <Grid container item xs={12} sm={2} direction="column" spacing={1}>
        <Grid item xs>
          <PlayerList players={players} currentPool={currentPool} />
        </Grid>

        <Grid item xs>
          <RoomOptionsList options={options} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export interface RoomInstanceProps {
  room: Room<TeamGeneratorState>;
  state: TeamGeneratorState;
  player: Player;
}

export const RoomInstance: React.FC<RoomInstanceProps> = ({
  room,
  state,
  player,
}: RoomInstanceProps) => {
  const players = Array.from(state.players.values());
  const playerName = player.name;
  const allPlayersReady = every('ready', players);
  const allTeamSizes = map(player => player.team.length, players);
  const currentPool = (min(allTeamSizes) || 0) + 1;
  const allTeamsSelected = currentPool > state.options.teamSize;
  let content;

  const setPlayerName = (name: string) => {
    room.send('player-set-name', name);
  };

  const togglePlayerReady = () => {
    room.send('player-set-ready', !player.ready);
  };

  const addToTeam = (value: Pokemon) => {
    room.send('player-team-add', value);
  };

  if (playerName === 'Anonymous') {
    content = <PlayerName onSubmit={setPlayerName} />;
  } else if (allTeamsSelected) {
    content = (
      <RoomContentContainer
        players={players}
        options={state.options}
        currentPool={currentPool}
        header={
          <Typography
            variant="subtitle1"
            component="h3"
            align="center"
            gutterBottom
          >
            Summary
          </Typography>
        }
      >
        <Grid container spacing={4}>
          <Grid item>
            <Typography align="center">{JSON.stringify(players)}</Typography>
          </Grid>
        </Grid>
      </RoomContentContainer>
    );
  } else if (allPlayersReady) {
    content = (
      <RoomContentContainer
        players={players}
        options={state.options}
        currentPool={currentPool}
        header={
          <Typography
            variant="subtitle1"
            component="h3"
            align="center"
            gutterBottom
          >
            Pool {currentPool} / {state.options.teamSize}
          </Typography>
        }
      >
        <Grid container justify="center" spacing={4}>
          <Grid item>
            <Button
              onClick={() => addToTeam({species: '0'})}
              variant="contained"
              color="primary"
            >
              0
            </Button>
          </Grid>

          <Grid item>
            <Button
              onClick={() => addToTeam({species: '1'})}
              variant="contained"
              color="primary"
            >
              1
            </Button>
          </Grid>

          <Grid item>
            <Button
              onClick={() => addToTeam({species: '2'})}
              variant="contained"
              color="primary"
            >
              2
            </Button>
          </Grid>
        </Grid>
      </RoomContentContainer>
    );
  } else {
    content = (
      <RoomContentContainer
        players={players}
        options={state.options}
        currentPool={currentPool}
        header={
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Room code: {room.id}
          </Typography>
        }
      >
        <Grid container justify="center">
          <Grid item xs={12} sm={8} md={5} lg={3} xl={2}>
            <Button
              onClick={togglePlayerReady}
              variant="contained"
              color="primary"
              fullWidth
            >
              Ready
            </Button>
          </Grid>
        </Grid>
      </RoomContentContainer>
    );
  }

  return content;
};
