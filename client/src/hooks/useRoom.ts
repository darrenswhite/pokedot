import {Schema} from '@colyseus/schema';
import {Client, Room} from 'colyseus.js';
import {useContext, useEffect, useState} from 'react';

import {
  RoomContext,
  initialRoom,
  initialState,
} from '../modules/team-generator/RoomProvider';
import {
  Options,
  TeamGeneratorState,
} from '../modules/team-generator/TeamGeneratorState';

export const ROOM_ID_LENGTH = 4;

export const LOCAL_STORAGE_KEY_ROOM_ID = 'pokedot-room-id';
export const LOCAL_STORAGE_KEY_SESSION_ID = 'pokedot-session-id';

export interface UseCreateRoomReturnType {
  createRoom: (
    roomName: string,
    options: Options,
    cb: (room: Room<TeamGeneratorState>) => Promise<unknown>
  ) => void;
  client: Client;
  room: Room<TeamGeneratorState>;
  isLoading: boolean;
  error: string | null;
}

export interface UseJoinRoomReturnType {
  client: Client;
  room: Room<TeamGeneratorState>;
  state: TeamGeneratorState;
  isLoading: boolean;
  error: string | null;
}

export const useCreateRoom = (): UseCreateRoomReturnType => {
  const {client, room, setRoom} = useContext(RoomContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = (
    roomName: string,
    options: Options,
    cb: (room: Room<TeamGeneratorState>) => Promise<unknown>
  ) => {
    setError(null);
    setIsLoading(true);

    createNewRoom(client, roomName, options)
      .then(room => {
        setRoom(room);
        cb(room)
          .then(() => {
            setIsLoading(false);
          })
          .catch(e => {
            console.error(
              `Failed to invoke create room callback ${roomName} ${room.id}.`,
              e
            );
            setError('Failed to create room.');
            setIsLoading(false);
          });
      })
      .catch(e => {
        console.error(`Failed to create room.`, e);
        setError('Failed to create room.');
        setIsLoading(false);
      });
  };

  return {
    createRoom,
    client,
    room,
    isLoading,
    error,
  };
};

export const useJoinRoom = (
  unnormalizedRoomId: string
): UseJoinRoomReturnType => {
  const {client, room, setRoom, state, setState} = useContext(RoomContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const roomId = normalizeRoomId(unnormalizedRoomId);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (roomId.length !== ROOM_ID_LENGTH) {
      setError('Invalid room code format.');
      setIsLoading(false);
    } else if (room.id === roomId) {
      setIsLoading(false);
    } else {
      if (room !== initialRoom) {
        console.log(`Leaving current room ${room.id}.`);
        room.leave();
      }

      setRoom(initialRoom);
      setState(initialState());

      rejoinOrJoinRoom(client, roomId)
        .then(room => {
          setRoom(room);
          setIsLoading(false);
        })
        .catch(e => {
          console.error(`Failed to join room ${roomId}.`, e);
          setError(`Failed to join room ${roomId}.`);
          setIsLoading(false);
        });
    }
  }, [room, client, roomId, setRoom, setState]);

  return {client, room, state, isLoading, error};
};

export const useRoomListeners = (): void => {
  const {room, setState} = useContext(RoomContext);

  useEffect(() => {
    if (room) {
      room.onLeave(code => {
        console.log(`Client left room: ${code}`);
      });
      room.onError(err => {
        console.error(`Room error: ${err}`);
      });
      room.onStateChange(state => {
        setState(((state as unknown) as Schema).toJSON() as TeamGeneratorState);
      });

      return () => {
        room.removeAllListeners();
      };
    }
  }, [room, setState]);
};

const createNewRoom = async (
  client: Client,
  roomName: string,
  options: Options
): Promise<Room<TeamGeneratorState>> => {
  const room = await client.create<TeamGeneratorState>(roomName, options);

  addRoomSessionCache(room);

  return room;
};

const rejoinOrJoinRoom = async (
  client: Client,
  roomId: string
): Promise<Room<TeamGeneratorState>> => {
  let room;

  const existingRoomId = getRoomIdCache();
  const existingSessionId = getSessionIdCache();

  if (existingRoomId && existingSessionId && existingRoomId === roomId) {
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
  roomId: string
): Promise<Room<TeamGeneratorState>> => {
  const room = await client.joinById<TeamGeneratorState>(roomId);

  addRoomSessionCache(room);

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
