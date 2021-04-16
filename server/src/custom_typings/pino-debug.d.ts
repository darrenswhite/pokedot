declare module 'pino-debug' {
  import {Logger} from 'pino';

  const pinoDebug: (logger: Logger, options: Record<string, unknown>) => void;

  export = pinoDebug;
}
