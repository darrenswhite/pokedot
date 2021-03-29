import React from 'react';
import {Button, Grid, Typography} from '@material-ui/core';
import {every, map, min} from 'lodash/fp';
import {getSocket} from '../../hooks/useSocket';
import {Player, PlayerId, Pokemon, Room} from './Room';
import {PlayerName} from './PlayerName';
import {PlayerList} from './PlayerList';
import {RoomOptionsList} from './RoomOptionsList';

interface RoomContentContainerProps {
  children: NonNullable<React.ReactNode>;
  header?: React.ReactNode;
  room: Room;
  currentPool: number;
}

const RoomContentContainer: React.FC<RoomContentContainerProps> = ({
  children,
  header,
  room,
  currentPool,
}: RoomContentContainerProps) => {
  return (
    <Grid container style={{height: '100%'}}>
      <Grid container item xs={12} sm={10} justify="center">
        <Grid item xs>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Room code: {room.id}
          </Typography>

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
          <PlayerList players={room.players} currentPool={currentPool} />
        </Grid>

        <Grid item xs>
          <RoomOptionsList options={room.options} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export interface RoomInstanceProps {
  room: Room;
  playerId: PlayerId;
}

export const RoomInstance: React.FC<RoomInstanceProps> = ({
  room,
  playerId,
}: RoomInstanceProps) => {
  const socket = getSocket();
  const playerName = room.players[playerId].name;
  const allPlayersReady = every('ready', room.players);
  const allTeamSizes = map(player => player.team.length, room.players);
  const currentPool = (min(allTeamSizes) || 0) + 1;
  const allTeamsSelected = currentPool > room.options.teamSize;
  let content;

  const updatePlayerName = (name: string) => {
    const player = room.players[playerId];

    updatePlayer({
      ...player,
      name,
    });
  };

  const setPlayerReady = () => {
    const player = room.players[playerId];

    updatePlayer({
      ...player,
      ready: true,
    });
  };

  const addToTeam = (value: Pokemon) => {
    const player = room.players[playerId];

    updatePlayer({
      ...player,
      team: [...player.team, value],
    });
  };

  const updatePlayer = (player: Player) => {
    socket.emit('update-player', player);
  };

  if (playerName === 'Anonymous') {
    content = <PlayerName onSubmit={updatePlayerName} />;
  } else if (allTeamsSelected) {
    content = (
      <RoomContentContainer
        room={room}
        currentPool={currentPool}
        header={
          <>
            <Typography
              variant="subtitle1"
              component="h3"
              align="center"
              gutterBottom
            >
              Summary
            </Typography>
          </>
        }
      >
        <Grid container spacing={4}>
          <Grid item>
            <Typography align="center">
              {JSON.stringify(room.players)}
            </Typography>
          </Grid>
        </Grid>
      </RoomContentContainer>
    );
  } else if (allPlayersReady) {
    content = (
      <RoomContentContainer
        room={room}
        currentPool={currentPool}
        header={
          <>
            <Typography
              variant="subtitle1"
              component="h3"
              align="center"
              gutterBottom
            >
              Pool {currentPool} / {room.options.teamSize}
            </Typography>
          </>
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
      <RoomContentContainer room={room} currentPool={currentPool}>
        <Grid container justify="center">
          <Grid item xs={12} sm={8} md={5} lg={3} xl={2}>
            <Button
              onClick={setPlayerReady}
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
