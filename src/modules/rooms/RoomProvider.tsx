import React, {createContext, useState} from 'react';
import {Client, Room} from 'colyseus.js';
import {noop} from 'lodash/fp';
import {TeamGeneratorState} from './TeamGeneratorState';

const client = new Client();

export interface RoomContextProps {
  client: Client;
  room: Room<TeamGeneratorState> | null;
  setRoom: (room: Room<TeamGeneratorState> | null) => void;
  state: TeamGeneratorState | null;
  setState: (state: TeamGeneratorState | null) => void;
}

export const RoomContext = createContext<RoomContextProps>({
  client: client,
  room: null,
  setRoom: noop,
  state: null,
  setState: noop,
});

export interface RoomProviderProps {
  children: NonNullable<React.ReactNode>;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({
  children,
}: RoomProviderProps) => {
  const [room, setRoom] = useState<Room<TeamGeneratorState> | null>(null);
  const [state, setState] = useState<TeamGeneratorState | null>(null);

  return (
    <RoomContext.Provider value={{client, room, setRoom, state, setState}}>
      {children}
    </RoomContext.Provider>
  );
};
