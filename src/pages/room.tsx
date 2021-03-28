import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {getSocket, useSocket} from '../hooks/useSocket';

const socket = getSocket();

const CreateOrJoinRoom: React.FC = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const createRoom = () => socket.emit('createroom');
  const joinRoom = () => router.push(`/rooms/${roomId}`);

  useSocket('roomcreated', roomId => router.push(`/rooms/${roomId}`));

  return (
    <div>
      <button onClick={createRoom}>Create room</button>

      <input
        type="text"
        placeholder="Enter room id..."
        onChange={e => setRoomId(e.target.value)}
        value={roomId}
      />
      <button onClick={joinRoom}>Join room</button>
    </div>
  );
};

export default CreateOrJoinRoom;
