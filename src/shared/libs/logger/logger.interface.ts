export interface ILogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string, error: Error, ...args: unknown[]): void;
  debug(message: string): void;
}
