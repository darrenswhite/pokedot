import React from 'react';
import Error from '../src/components/layout/Error';

const messages = [
  "What do you want? You can't pass through here right now! We're on guard duty! It's very important!",
  "What're you doing here, twerp? Shoo! Go pester someone else!",
  'Hey, do you want to join Team Rocket?',
];

const Error404: React.FC = () => {
  return <Error statusCode={404} avatarName="teamrocket" messages={messages} />;
};

export default Error404;
