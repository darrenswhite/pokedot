import {Button, Grid, Typography} from '@material-ui/core';
import {Room} from 'colyseus.js';
import React from 'react';

import {PlayerList} from './PlayerList';
import {PlayerName} from './PlayerName';
import {RoomOptionsList} from './RoomOptionsList';
import {
  Player,
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
  const {currentPool, currentPoolTime, options} = state;
  const players = Array.from(state.players.values());
  const playerName = player.name;
  const showPoolSelections = currentPool !== -1;
  const showSummary = currentPool === options.teamSize;
  let content;

  const setPlayerName = (name: string) => {
    room.send('SET_PLAYER_NAME', {
      name,
    });
  };

  const togglePlayerReady = () => {
    room.send('SET_PLAYER_READY');
  };

  const selectFromPool = (index: number) => {
    room.send('SET_PLAYER_POOL_SELECTION', {
      index,
    });
  };

  if (playerName === 'Anonymous') {
    content = <PlayerName onSubmit={setPlayerName} />;
  } else if (showSummary) {
    content = (
      <RoomContentContainer
        players={players}
        options={options}
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
  } else if (showPoolSelections) {
    content = (
      <RoomContentContainer
        players={players}
        options={options}
        currentPool={currentPool}
        header={
          <Typography
            variant="subtitle1"
            component="h3"
            align="center"
            gutterBottom
          >
            Pool {currentPool + 1} / {options.teamSize} (
            {currentPoolTime / 1000}s)
          </Typography>
        }
      >
        <Grid container justify="center" spacing={4}>
          {player.pool.map((pokemon, index) => (
            <Grid item key={index}>
              <Button
                onClick={() => selectFromPool(index)}
                variant="contained"
                color="primary"
              >
                {pokemon.species}
              </Button>
            </Grid>
          ))}
        </Grid>
      </RoomContentContainer>
    );
  } else {
    content = (
      <RoomContentContainer
        players={players}
        options={options}
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
