import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {CircularProgress, Grid, Typography} from '@material-ui/core';
import {getSocket, useSocket} from '../../hooks/useSocket';
import {Player, PlayerId, Room, ROOM_ID_LENGTH} from './Room';
import {RoomInstance} from './RoomInstance';

export const RoomPage: React.FC = () => {
  const router = useRouter();
  const roomId = router.query.roomId;
  const socket = getSocket();
  const [joinRoomError, setJoinRoomError] = useState<string>('');
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<PlayerId>('');
  let content;

  const joinRoom = () => {
    setRoom(null);
    setPlayerId('');
    setJoinRoomError('');

    if (roomId?.length === ROOM_ID_LENGTH) {
      socket.emit(
        'join-room',
        roomId,
        (event: string, room: Room, playerId: PlayerId) => {
          if (event === 'room-joined') {
            setRoom(room);
            setPlayerId(playerId);
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

  useSocket('connected', joinRoom);

  useEffect(() => {
    if (socket.connected) {
      joinRoom();
    }
  }, [socket.connected, roomId]);

  useSocket('players-updated', (players: Record<PlayerId, Player>) => {
    if (room) {
      setRoom({
        ...room,
        players,
      });
    }
  });

  if (joinRoomError) {
    content = (
      <Grid
        container
        justify="center"
        alignContent="center"
        style={{height: '100%'}}
      >
        <Grid item>
          <Typography>{joinRoomError}</Typography>
        </Grid>
      </Grid>
    );
  } else if (room && playerId) {
    content = <RoomInstance room={room} playerId={playerId} />;
  } else {
    content = (
      <Grid
        container
        justify="center"
        alignContent="center"
        style={{height: '100%'}}
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return content;
};
