import { readFileSync } from 'node:fs';
import { ICommandHandler } from './command-handler.interface.js';
import chalk from 'chalk';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ILogger } from '../shared/libs/logger/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/types/index.js';

@injectable()
export class VersionCommand implements ICommandHandler {
  public readonly name = '--version';

  constructor(@inject(Component.Logger) private readonly logger: ILogger) {}

  private getVersion(): string {
    const currentFilePath = fileURLToPath(import.meta.url);
    const packageJsonPath = resolve(currentFilePath, '../../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version;
  }

  public async execute(): Promise<void> {
    const version = this.getVersion();
    this.logger.info(chalk.blue.bold(version));
  }
}
