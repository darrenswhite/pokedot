import {Client, Room} from 'colyseus.js';
import {noop, range} from 'lodash/fp';
import React, {createContext, useState} from 'react';

import {socketUrl} from '../../util/constants';

import {Pool, TeamGeneratorState} from './TeamGeneratorState';

const client = new Client(socketUrl);

export const initialRoom = new Room<TeamGeneratorState>('');

export const initialPoolState = (): Pool => ({
  fullyEvolved: true,
  notFullyEvolved: false,
  restrictedLegendaries: false,
  subLegendaries: false,
  mythicals: false,
  minimumBaseStatTotal: 0,
  maximumBaseStatTotal: 0,
});

export const initialState = (): TeamGeneratorState => ({
  options: {
    pools: range(0, 6).map(initialPoolState),
    poolSize: 6,
    poolSelectionTime: 30000,
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
