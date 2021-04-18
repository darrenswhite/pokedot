// pino-debug must be required at the entry point of your node process, before any other modules have been loaded
// see https://github.com/pinojs/pino-debug
// eslint-disable-next-line import/order
import {Logger} from './util/Logger';

import {createServer} from 'http';

import {monitor} from '@colyseus/monitor';
import {Server} from 'colyseus';
import config from 'config';
import cors from 'cors';
import express from 'express';

import {FormatController} from './controller/FormatController';
import {PoolController} from './controller/PoolController';
import {Controllers} from './decorator/Controller';
import {TeamGeneratorRoom} from './team-generator/TeamGeneratorRoom';

Logger.info('Starting up...');

const app = express();

const port = config.get<number>('server.port');

app.use(cors());
app.use(express.json());
app.use(Logger.express);

const gameServer = new Server({
  server: createServer(app),
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
