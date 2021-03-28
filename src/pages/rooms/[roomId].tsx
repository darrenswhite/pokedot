import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import {getSocket, useSocket} from '../../hooks/useSocket';

interface Message {
  id: number;
  value: string;
}

export const Room: React.FC = () => {
  const router = useRouter();
  const {roomId} = router.query;
  const socket = getSocket();
  const [field, setField] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    if (socket.connected) {
      socket.emit('joinroom', roomId);
    }
  }, [socket.connected]);

  useSocket(
    'roomjoined',
    ({players, messages}: {players: string[]; messages: Message[]}) => {
      const name = prompt("What's your name?") || '';

      socket.emit('addplayer', name);
      setPlayers([...players, name]);
      setMessages(messages);
      console.log('Player added: ' + name);
    }
  );

  useSocket('updatemessages', (messages: Message[]) => {
    console.log('Update messages: ' + messages);
    setMessages(messages);
  });

  useSocket('updateplayers', (players: string[]) => {
    console.log('Update players: ' + players);
    setPlayers(players);
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = {
      id: new Date().getTime(),
      value: field,
    };

    socket.emit('sendmessage', message);
    setField('');
    setMessages([...messages, message]);
    console.log('Sent message: ' + message);
  };

  return (
    <div>
      Players:
      <ul>
        {players.map(player => (
          <li key={player}>{player}</li>
        ))}
      </ul>
      Messages:
      <ul>
        {messages.map(message => (
          <li key={message.id}>{message.value}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          onChange={e => setField(e.target.value)}
          type="text"
          placeholder="Enter message..."
          value={field}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default Room;
