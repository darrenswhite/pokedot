import {Client, Room} from 'colyseus.js';
import {cloneDeep} from 'lodash/fp';
import {useContext, useEffect, useState} from 'react';

import {RoomContext} from '../modules/rooms/RoomProvider';
import {
  TeamGeneratorOptions,
  TeamGeneratorState,
} from '../modules/rooms/TeamGeneratorState';

export const ROOM_ID_LENGTH = 4;

export const LOCAL_STORAGE_KEY_ROOM_ID = 'pokedot-room-id';
export const LOCAL_STORAGE_KEY_SESSION_ID = 'pokedot-session-id';
export const LOCAL_STORAGE_KEY_ROOM_SESSION = 'pokedot-room-session';

export interface UseRoomReturnType {
  client: Client;
  room: Room<TeamGeneratorState> | null;
  state: TeamGeneratorState | null;
  error: string | null;
}

export const createRoom = async (
  client: Client,
  roomName: string,
  options: TeamGeneratorOptions
): Promise<Room<TeamGeneratorState>> => {
  let room;

  try {
    room = await client.create<TeamGeneratorState>(roomName, options);

    console.log(`Created room ${room.id}.`);
  } catch (e) {
    console.error(`Failed to create room ${roomName}: ${e}`);
    throw new Error(`Failed to create room ${roomName}: ${e}`);
  }

  return room;
};

export const useJoinRoom = (roomId: string): UseRoomReturnType => {
  const {client, room, setRoom, state, setState} = useContext(RoomContext);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (roomId.length == ROOM_ID_LENGTH && (!room || room.id !== roomId)) {
      if (room) {
        console.log(`Leaving current room ${room.id}.`);
        room.leave();
        setRoom(null);
      }

      setError(null);

      rejoinOrJoinRoom(client, roomId)
        .then(room => {
          setRoom(room);
          setState(room.state);
        })
        .catch(err => {
          setError(err);
        });
    }
  }, [room, client, roomId, setRoom, setState]);

  return {client, room, state, error};
};

export const useRoomListeners = (): void => {
  const {room, setState} = useContext(RoomContext);

  useEffect(() => {
    if (room) {
      room.onLeave((...args) => {
        console.log(`Client left room: ${args}`);
      });
      room.onError(err => {
        console.error(`Room error: ${err}`);
      });
      room.onStateChange(state => {
        setState(cloneDeep(state));
      });

      return () => {
        room.removeAllListeners();
      };
    }
  }, [room, setState]);
};

const rejoinOrJoinRoom = async (
  client: Client,
  unnormalizedRoomId: string
): Promise<Room<TeamGeneratorState>> => {
  let room;

  const roomId = normalizeRoomId(unnormalizedRoomId);

  const existingRoomId = getRoomIdCache();
  const existingSessionId = getSessionIdCache();

  if (existingRoomId && existingSessionId) {
    try {
      room = await client.reconnect<TeamGeneratorState>(
        existingRoomId,
        existingSessionId
      );

      console.log(`Re-joined room ${room.id}.`);
    } catch (e) {
      console.warn(`Failed to re-join room, ${roomId} joining new session.`, e);
      removeRoomSessionCache();
      room = joinRoom(client, roomId);
    }
  } else {
    room = joinRoom(client, roomId);
  }

  return room;
};

const joinRoom = async (
  client: Client,
  unnormalizedRoomId: string
): Promise<Room<TeamGeneratorState>> => {
  let room;

  const roomId = normalizeRoomId(unnormalizedRoomId);

  if (roomId.length === ROOM_ID_LENGTH) {
    try {
      room = await client.joinById<TeamGeneratorState>(roomId);

      addRoomSessionCache(room);
    } catch (e) {
      throw new Error(`Failed to join room ${roomId}: ${e}`);
    }
  } else {
    throw new Error(`Invalid room code format: ${roomId}.`);
  }

  return room;
};

const normalizeRoomId = (roomId: string): string => {
  return roomId.trim().toUpperCase();
};

const addRoomSessionCache = (room: Room): void => {
  if (localStorage) {
    localStorage.setItem(LOCAL_STORAGE_KEY_ROOM_ID, room.id);
    localStorage.setItem(LOCAL_STORAGE_KEY_SESSION_ID, room.sessionId);
  }
};

const removeRoomSessionCache = (): void => {
  if (localStorage) {
    localStorage.removeItem(LOCAL_STORAGE_KEY_ROOM_ID);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SESSION_ID);
  }
};

const getRoomIdCache = (): string | null => {
  let roomId;

  if (localStorage) {
    roomId = localStorage.getItem(LOCAL_STORAGE_KEY_ROOM_ID);
  } else {
    roomId = null;
  }

  return roomId;
};

const getSessionIdCache = (): string | null => {
  let sessionId;

  if (localStorage) {
    sessionId = localStorage.getItem(LOCAL_STORAGE_KEY_SESSION_ID);
  } else {
    sessionId = null;
  }

  return sessionId;
};
