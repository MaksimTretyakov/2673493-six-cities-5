import { ILogger } from './logger.interface.js';
import { pino, Logger as PinoInstance, transport } from 'pino';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { injectable } from 'inversify';

@injectable()
export class PinoLogger implements ILogger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = fileURLToPath(import.meta.url);
    const moduleDirectory = dirname(modulePath);
    const logFilePath = resolve(moduleDirectory, '../../../../', 'logs/rest.log');

    const multiTransport = transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination: logFilePath },
          level: 'info'
        },
        {
          target: 'pino-pretty',
          options: {
            ignore: 'time,hostname,pid,level'
          },
          level: 'info'
        }
      ]
    });

    this.logger = pino({}, multiTransport);
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }
}
