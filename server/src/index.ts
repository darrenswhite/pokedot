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
import request from 'request';
import {Statistics} from 'smogon';

import {Stats} from './Stats';
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

app.use('/stats/formats/latest', async (req, res) => {
  const date = await Stats.getLatestDate();
  const formats = await Stats.getFormats(date);

  res.json(formats);
});

app.use('/stats/latest/:format', async (req, res) => {
  const format = req.params.format;
  const weightParam = req.query.weight;
  let weight;

  if (typeof weightParam === 'string') {
    weight = parseInt(weightParam);
  }

  if (format) {
    const date = await Stats.getLatestDate();

    const url = Statistics.url(date, format, weight);

    Logger.info({weight}, 'weight');
    Logger.info(url);

    request(url).pipe(res);
  } else {
    res.send(400);
  }
});

app.use('/colyseus', monitor());

gameServer.listen(port).then(() => {
  Logger.info(`Listening on port ${port}.`);
});
