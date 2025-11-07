export const Component = {
  Application: Symbol.for('Application'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  HelpCommand: Symbol.for('HelpCommand'),
  VersionCommand: Symbol.for('VersionCommand'),
  ImportCommand: Symbol.for('ImportCommand'),
  GenerateCommand: Symbol.for('GenerateCommand'),
} as const;
