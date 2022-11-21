// pino-debug must be required at the entry point of your node process, before any other modules have been loaded
// see https://github.com/pinojs/pino-debug
// eslint-disable-next-line import/order
import {Logger} from './util/Logger.js';

import {createServer} from 'http';

import {monitor} from '@colyseus/monitor';
import {WebSocketTransport} from '@colyseus/ws-transport';
import {Server} from 'colyseus';
import config from 'config';
import cors from 'cors';
import express, {json} from 'express';

import {FormatController} from './controller/FormatController.js';
import {PoolController} from './controller/PoolController.js';
import {Controllers} from './decorator/Controller.js';
import {TeamGeneratorRoom} from './team-generator/TeamGeneratorRoom.js';

Logger.info('Starting up...');

const app = express();

const port = config.get<number>('server.port');

app.use(cors());
app.use(json() as express.RequestHandler);
app.use(Logger.express as express.RequestHandler);

const gameServer = new Server({
  transport: new WebSocketTransport({
    server: createServer(app),
  }),
});

gameServer.define('team-generator', TeamGeneratorRoom);

app.use(Controllers([FormatController, PoolController]));
app.use('/colyseus', monitor());

gameServer
  .listen(port)
  .then(() => {
    Logger.info(`Listening on port ${port}.`);
  })
  .catch((err: unknown) => {
    Logger.error({err}, `Failed to start on port ${port}.`);
  });
