import config from 'config';
import expressPino from 'express-pino-logger';
import pino from 'pino';
import pinoDebug from 'pino-debug';

const root = pino({
  level: config.get<string>('log.level'),
  prettyPrint: config.get<boolean>('env.dev')
    ? {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: true,
      }
    : false,
});

pinoDebug(root, {
  map: {
    '*': 'trace',
  },
});

export class Logger {
  static express = expressPino({
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
