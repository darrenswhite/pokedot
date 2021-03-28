import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {CircularProgress, Typography} from '@material-ui/core';
import {getSocket, useSocket} from '../../hooks/useSocket';
import {Player, PlayerId, Room, RoomOptions, ROOM_ID_LENGTH} from './Room';

export const RoomPage: React.FC = () => {
  const router = useRouter();
  const roomId = router.query.roomId;
  const socket = getSocket();
  const [joinRoomError, setJoinRoomError] = useState<string>('');
  const [options, setOptions] = useState<RoomOptions | null>(null);
  const [players, setPlayers] = useState<Record<PlayerId, Player>>({});
  const [joined, setJoined] = useState<boolean>(false);
  let content;

  const joinRoom = () => {
    setOptions(null);
    setPlayers({});
    setJoined(false);
    setJoinRoomError('');

    if (roomId?.length === ROOM_ID_LENGTH) {
      socket.emit('join-room', roomId, (event: string, room: Room) => {
        if (event === 'room-joined') {
          setOptions(room.options);
          setPlayers(room.players);
          setJoined(true);
        } else if (event === 'room-invalid') {
          setJoinRoomError('Room does not exist');
        } else if (event === 'room-join-error') {
          setJoinRoomError('Failed to join room');
        }
      });
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
    setPlayers(players);
  });

  if (joinRoomError) {
    content = <Typography>{joinRoomError}</Typography>;
  } else if (joined) {
    content = (
      <div>
        Players:
        <ul>
          {Object.entries(players).map(([id, player]) => (
            <li key={id}>
              {id}: {player.id}
            </li>
          ))}
        </ul>
        Options: {JSON.stringify(options)}
      </div>
    );
  } else {
    content = <CircularProgress />;
  }

  return content;
};
