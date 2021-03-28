import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import {getSocket, useSocket} from '../../hooks/useSocket';
import {Player, PlayerId, Room, RoomOptions, ROOM_ID_LENGTH} from './Room';

export const RoomPage: React.FC = () => {
  const router = useRouter();
  const roomId = router.query.roomId;
  const socket = getSocket();
  const [joinRoomError, setJoinRoomError] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [options, setOptions] = useState<RoomOptions | null>(null);
  const [players, setPlayers] = useState<Record<PlayerId, Player>>({});
  const [joined, setJoined] = useState<boolean>(false);
  const [waitingRoom, setWaitingRoom] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<PlayerId>('');
  let content;

  const joinRoom = () => {
    setOptions(null);
    setPlayers({});
    setJoined(false);
    setWaitingRoom(false);
    setPlayerId('');
    setJoinRoomError('');

    if (roomId?.length === ROOM_ID_LENGTH) {
      socket.emit(
        'join-room',
        roomId,
        (event: string, room: Room, playerId: PlayerId) => {
          if (event === 'room-joined') {
            setOptions(room.options);
            setPlayers(room.players);
            setPlayerId(playerId);
            setJoined(true);
          } else if (event === 'room-invalid') {
            setJoinRoomError('Room does not exist');
          } else if (event === 'room-join-error') {
            setJoinRoomError('Failed to join room');
          }
        }
      );
    } else {
      setJoinRoomError('Invalid room code');
    }
  };

  const submitName = () => {
    setNameError('');

    if (name.trim().length > 0) {
      setWaitingRoom(true);
      updatePlayer({
        ...players[playerId],
        name,
      });
    } else {
      setNameError('Name is required');
    }
  };

  const updatePlayer = (player: Player) => {
    socket.emit('update-player', player);
  };

  useSocket('connected', joinRoom);

  useEffect(() => {
    if (socket.connected) {
      joinRoom();
    }
  }, [socket.connected, roomId]);

  useSocket('players-updated', (players: Record<PlayerId, Player>) => {
    setPlayers(players);
  });

  if (joinRoomError) {
    content = (
      <Box display="flex" p={1} justifyContent="center">
        <Typography>{joinRoomError}</Typography>
      </Box>
    );
  } else if (joined) {
    if (waitingRoom) {
      content = (
        <div>
          <div>
            {Object.values(players).map(player => (
              <div key={player.id}>
                {player.name} ({player.id})
              </div>
            ))}
          </div>
          <div>{JSON.stringify(options)}</div>
        </div>
      );
    } else {
      content = (
        <>
          <Box display="flex" p={1} justifyContent="center">
            <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
              <TextField
                label="Nickname"
                placeholder="Enter name..."
                onChange={e => setName(e.target.value)}
                onKeyUp={e => e.key === 'Enter' && submitName()}
                value={name}
                helperText={nameError}
                error={!!nameError}
                fullWidth
              />
            </Grid>
          </Box>

          <Box display="flex" p={1} justifyContent="center">
            <Grid item xs={12} sm={4} md={3} lg={2} xl={1}>
              <Button
                onClick={submitName}
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Box>
        </>
      );
    }
  } else {
    content = (
      <Box display="flex" p={1} justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      height="100%"
      alignContent="center"
      justifyContent="center"
      flexDirection="column"
    >
      {content}
    </Box>
  );
};
