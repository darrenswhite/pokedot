const {Server} = require('colyseus');
const express = require('express');
const {createServer} = require('http');
const next = require('next');
const {TeamGenerator} = require('./TeamGenerator');

const port = Number(process.env.PORT || 3000);
const dev = process.env.NODE_ENV !== 'production';

const app = express();

const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler();

const gameServer = new Server({
  server: createServer(app),
});

gameServer.define('team-generator', TeamGenerator);

nextApp.prepare().then(() => {
  app.get('*', nextHandler);

  gameServer.listen(port, err => {
    if (err) {
      throw err;
    }

    console.log(`Listening on port ${port}.`);
  });
});
