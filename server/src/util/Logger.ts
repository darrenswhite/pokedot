import config from 'config';
import {pinoHttp} from 'express-pino-logger';
import {pino} from 'pino';
import pinoDebug from 'pino-debug';
import pinoPretty from 'pino-pretty';

const stream = pinoPretty.default({
  colorize: true,
  ignore: 'pid,hostname',
  translateTime: true,
});

const options = {
  level: config.get<string>('log.level'),
};

const root = config.get<boolean>('env.dev')
  ? pino(options, stream)
  : pino(options);

pinoDebug(root, {
  map: {
    '*': 'trace',
  },
});

export class Logger {
  static express = pinoHttp({
    logger: root,
  });

  static debug = root.debug.bind(root);

  static error = root.error.bind(root);

  static fatal = root.fatal.bind(root);

  static info = root.info.bind(root);

  static trace = root.trace.bind(root);

  static warn = root.warn.bind(root);

  static child = root.child.bind(root);
}
