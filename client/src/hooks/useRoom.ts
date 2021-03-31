import {Client, Room} from 'colyseus.js';
import {cloneDeep} from 'lodash/fp';
import {useContext, useState} from 'react';

import {RoomContext} from '../modules/rooms/RoomProvider';
import {
  TeamGeneratorOptions,
  TeamGeneratorState,
} from '../modules/rooms/TeamGeneratorState';

export const ROOM_ID_LENGTH = 9;

export const LOCAL_STORAGE_KEY_ROOM_SESSION = 'pokedot-room-session';

export interface UseRoomReturnType {
  client: Client;
  room: Room<TeamGeneratorState> | null;
  state: TeamGeneratorState | null;
  error: string | null;
  createRoom: (
    roomName: string,
    options: TeamGeneratorOptions
  ) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
}

export const useRoom = (): UseRoomReturnType => {
  const {client, room, setRoom, state, setState} = useContext(RoomContext);
  const [error, setError] = useState<string | null>(null);

  const addRoomSessionCache = () => {
    if (localStorage && room) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY_ROOM_SESSION,
        JSON.stringify({
          roomId: room.id,
          sessionId: room.sessionId,
        })
      );
    }
  };

  const removeRoomSessionCache = () => {
    if (localStorage) {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ROOM_SESSION);
    }
  };

  const getRoomSessionCache = () => {
    const existingSessionItem = localStorage
      ? localStorage.getItem(LOCAL_STORAGE_KEY_ROOM_SESSION)
      : null;

    return existingSessionItem ? JSON.parse(existingSessionItem) : null;
  };

  const createRoom = async (
    roomName: string,
    options: TeamGeneratorOptions
  ) => {
    if (room) {
      room.leave();
      setRoom(null);
    }

    setError(null);
    removeRoomSessionCache();

    try {
      const room = await client.create<TeamGeneratorState>(roomName, options);

      onRoomJoined(room);

      console.log(`Created and joined room ${room.id}.`);
    } catch (error) {
      console.error('Failed to create room.', error);
      setError('Failed to create room.');
      removeRoomSessionCache();
    }
  };

  const joinRoom = async (roomId: string) => {
    if (!room || room.id !== roomId) {
      if (room) {
        room.leave();
        setRoom(null);
      }

      setError(null);
      removeRoomSessionCache();

      const sessionCache = getRoomSessionCache();

      if (sessionCache) {
        try {
          const room = await client.reconnect<TeamGeneratorState>(
            sessionCache.roomId,
            sessionCache.sessionId
          );

          onRoomJoined(room);

          console.log(`Re-joined room ${room.id}.`);
        } catch (error) {
          console.warn(
            `Failed to re-join room, ${roomId} joining new session.`,
            error
          );
          removeRoomSessionCache();
          joinById(roomId);
        }
      } else {
        joinById(roomId);
      }
    }
  };

  const joinById = (roomId: string) => {
    if (roomId.length === ROOM_ID_LENGTH) {
      client
        .joinById<TeamGeneratorState>(roomId)
        .then(room => {
          onRoomJoined(room);

          console.log(`Joined room ${room.id}.`);
        })
        .catch(error => {
          console.error(`Failed to join room ${roomId}.`, error);
          setError('Unable to join room.');
          removeRoomSessionCache();
        });
    } else {
      setError('Invalid room code format.');
    }
  };

  const onRoomJoined = (room: Room<TeamGeneratorState>) => {
    addRoomSessionCache();

    room.onLeave(() => {
      localStorage.removeItem(LOCAL_STORAGE_KEY_ROOM_SESSION);
    });
    room.onError(error => {
      console.error(`Room error: `, error);
      localStorage.removeItem(LOCAL_STORAGE_KEY_ROOM_SESSION);
    });
    room.onStateChange(state => {
      setState(cloneDeep(state));
    });

    setRoom(room);
  };

  return {client, room, state, error, createRoom, joinRoom};
};
