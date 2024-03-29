import {Schema} from '@colyseus/schema';
import {Client, JoinOptions, Room} from 'colyseus.js';
import {Context, useContext, useEffect, useState} from 'react';

export const ROOM_ID_LENGTH = 4;

export const LOCAL_STORAGE_KEY_ROOM_ID = 'pokedot-room-id';
export const LOCAL_STORAGE_KEY_SESSION_ID = 'pokedot-session-id';

export interface RoomContext<S> {
  client: Client;
  initialRoom: Room<S>;
  room: Room<S>;
  setRoom: (room: Room<S>) => void;
  initialState: () => S;
  state: S;
  setState: (state: S) => void;
}

export interface UseCreateRoomReturnType<S> {
  createRoom: (
    roomName: string,
    options: JoinOptions,
    cb: (room: Room<S>) => Promise<unknown>
  ) => Promise<void>;
  client: Client;
  room: Room<S>;
  isLoading: boolean;
  error: string | null;
}

export interface UseJoinRoomReturnType<T> {
  client: Client;
  room: Room<T>;
  state: T;
  isLoading: boolean;
  error: string | null;
}

export const useCreateRoom = <S>(
  context: Context<RoomContext<S>>
): UseCreateRoomReturnType<S> => {
  const {client, initialRoom, room, setRoom, initialState, setState} =
    useContext(context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async (
    roomName: string,
    options: JoinOptions,
    cb: (room: Room<S>) => Promise<unknown>
  ): Promise<void> => {
    setError(null);
    setIsLoading(true);

    return leaveRoom(initialRoom, room, setRoom, initialState, setState).then(
      async () => {
        try {
          const room = await createNewRoom<S>(client, roomName, options);
          setRoom(room);
          setIsLoading(false);

          cb(room).catch(e => {
            console.error(
              `Failed to invoke create room callback ${roomName} ${room.id}.`,
              e
            );
            setError('Failed to create room.');
          });
        } catch (e) {
          console.error(`Failed to create room.`, e);
          setError('Failed to create room.');
          setIsLoading(false);
        }
      }
    );
  };

  return {
    createRoom,
    client,
    room,
    isLoading,
    error,
  };
};

export const useJoinRoom = <S>(
  context: Context<RoomContext<S>>,
  unnormalizedRoomId: string
): UseJoinRoomReturnType<S> => {
  const {client, initialRoom, room, setRoom, initialState, state, setState} =
    useContext(context);
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
      console.log(`Already in room ${roomId}.`);
      setIsLoading(false);
      setState(copyState(room.state));
    } else {
      leaveRoom(initialRoom, room, setRoom, initialState, setState)
        .then(() => {
          rejoinOrJoinRoom<S>(client, roomId)
            .then(room => {
              setRoom(room);
              setIsLoading(false);
            })
            .catch(e => {
              console.error(`Failed to join room ${roomId}.`, e);
              setError(`Failed to join room ${roomId}.`);
              setIsLoading(false);
            });
        })
        .catch(e => {
          console.error(`Failed to leave room ${room.id}.`, e);
          setError(`Failed to leave room ${room.id}.`);
          setIsLoading(false);
        });
    }

    return () => {
      leaveRoom(initialRoom, room, setRoom, initialState, setState).catch(e => {
        console.error(`Failed to leave room ${room.id}.`, e);
      });
    };
  }, [initialRoom, room, client, roomId, setRoom, initialState, setState]);

  return {client, room, state, isLoading, error};
};

export const useRoomListeners = <S>(context: Context<RoomContext<S>>): void => {
  const {room, setState} = useContext(context);

  useEffect(() => {
    if (room) {
      room.onLeave(code => {
        console.log(`Client left room (${code}).`);
      });
      room.onError((code, message) => {
        console.error(`Room error (${code}): ${message ?? 'no reason'}.`);
      });
      room.onStateChange(state => {
        setState(copyState(state));
      });

      return () => {
        room.removeAllListeners();
      };
    }
  }, [room, setState]);
};

const leaveRoom = async <S>(
  initialRoom: Room<S>,
  room: Room<S>,
  setRoom: (room: Room<S>) => void,
  initialState: () => S,
  setState: (state: S) => void
): Promise<void> => {
  if (room !== initialRoom) {
    console.log(`Leaving current room ${room.id}.`);
    room.removeAllListeners();
    await room.leave();
    setRoom(initialRoom);
    setState(initialState());
  }
};

const createNewRoom = async <S>(
  client: Client,
  roomName: string,
  options?: JoinOptions
): Promise<Room<S>> => {
  const room = await client.create<S>(roomName, options);

  console.log(`Created new room ${roomName} ${room.id}.`);

  addRoomSessionCache(room);

  return room;
};

const rejoinOrJoinRoom = async <S>(
  client: Client,
  roomId: string
): Promise<Room<S>> => {
  let room;

  const existingRoomId = getRoomIdCache();
  const existingSessionId = getSessionIdCache();

  if (existingRoomId && existingSessionId && existingRoomId === roomId) {
    try {
      console.log(`Attempting to re-join room ${roomId}...`);

      room = await client.reconnect<S>(existingRoomId, existingSessionId);

      console.log(`Re-joined room ${room.id}.`);
    } catch (e) {
      console.warn(`Failed to re-join room, ${roomId} joining new session.`, e);
      removeRoomSessionCache();
      room = joinRoom<S>(client, roomId);
    }
  } else {
    room = joinRoom<S>(client, roomId);
  }

  return room;
};

const joinRoom = async <S>(
  client: Client,
  roomId: string
): Promise<Room<S>> => {
  console.log(`Attempting to join room ${roomId}...`);

  const room = await client.joinById<S>(roomId);

  console.log(`Joined room ${room.id}`);

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

const copyState = <S>(state: S): S => {
  return (state as unknown as Schema).toJSON() as S;
};
