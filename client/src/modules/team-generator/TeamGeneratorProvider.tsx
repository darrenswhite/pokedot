import {Client, Room} from 'colyseus.js';
import {noop, range} from 'lodash/fp';
import React, {createContext, useState} from 'react';

import {RoomContext} from '../../hooks/useRoom';
import {socketUrl} from '../../util/constants';

import {Pool, TeamGeneratorState} from './TeamGeneratorState';

const client = new Client(socketUrl);

const initialRoom = new Room<TeamGeneratorState>('');

export const initialPoolState = (): Pool => ({
  fullyEvolved: true,
  notFullyEvolved: false,
  restrictedLegendaries: false,
  subLegendaries: false,
  mythicals: false,
  minimumBaseStatTotal: 0,
  maximumBaseStatTotal: 0,
});

const initialState = (): TeamGeneratorState => ({
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

export type TeamGeneratorContextProps = RoomContext<TeamGeneratorState>;

export const TeamGeneratorContext = createContext<TeamGeneratorContextProps>({
  client: client,
  initialRoom,
  room: initialRoom,
  setRoom: noop,
  initialState,
  state: initialState(),
  setState: noop,
});

export interface TeamGeneratorProviderProps {
  children: NonNullable<React.ReactNode>;
}

export const TeamGeneratorProvider: React.FC<TeamGeneratorProviderProps> = ({
  children,
}: TeamGeneratorProviderProps) => {
  const [room, setRoom] = useState<Room<TeamGeneratorState>>(initialRoom);
  const [state, setState] = useState<TeamGeneratorState>(initialState());

  return (
    <TeamGeneratorContext.Provider
      value={{
        client,
        initialRoom,
        room,
        setRoom,
        initialState,
        state,
        setState,
      }}
    >
      {children}
    </TeamGeneratorContext.Provider>
  );
};
