import {Client, Room} from 'colyseus.js';
import {noop} from 'lodash/fp';
import React, {createContext, useState} from 'react';

import {socketUrl} from '../../util/constants';

import {TeamGeneratorState} from './TeamGeneratorState';

const client = new Client(socketUrl);

export const initialRoom = new Room('');

export const initialState = (): TeamGeneratorState => ({
  options: {
    teamSize: 6,
    poolSize: 3,
    poolSelectionTime: 30000,
    legendaries: 0,
    mythicals: 0,
    exclusivePools: false,
    gen: 8,
  },
  players: {},
  currentPool: -1,
  currentPoolTime: -1,
});

export interface RoomContextProps {
  client: Client;
  room: Room<TeamGeneratorState>;
  setRoom: (room: Room<TeamGeneratorState>) => void;
  state: TeamGeneratorState;
  setState: (state: TeamGeneratorState) => void;
}

export const RoomContext = createContext<RoomContextProps>({
  client: client,
  room: initialRoom,
  setRoom: noop,
  state: initialState(),
  setState: noop,
});

export interface RoomProviderProps {
  children: NonNullable<React.ReactNode>;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({
  children,
}: RoomProviderProps) => {
  const [room, setRoom] = useState<Room<TeamGeneratorState>>(initialRoom);
  const [state, setState] = useState<TeamGeneratorState>(initialState());

  return (
    <RoomContext.Provider value={{client, room, setRoom, state, setState}}>
      {children}
    </RoomContext.Provider>
  );
};
