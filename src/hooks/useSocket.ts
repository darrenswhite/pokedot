import {useEffect} from 'react';
import io from 'socket.io-client';

const socket = io();

export const getSocket = (): SocketIOClient.Socket => socket;

export const useSocket = <T>(
  eventName: string,
  cb: (message: T) => void
): SocketIOClient.Socket => {
  useEffect(() => {
    socket.on(eventName, cb);

    return () => {
      socket.off(eventName, cb);
    };
  }, [eventName, cb]);

  return socket;
};
