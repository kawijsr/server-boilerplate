import { Client } from 'knex';

type LogFn = (message: any) => void;

interface LoggerDB {
  warn?: LogFn;
  error?: LogFn;
  debug?: LogFn;
  inspectionDepth?: number;
  enableColors?: boolean;
  deprecate?: (method: string, alternative: string) => void;
}

export interface ConnectionConfigProvider {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
}

export interface PoolConfig {
  name?: string;
  min?: number;
  max?: number;
  log?: (message: string, logLevel: string) => void;
  afterCreate?: Function;
}

export interface MigratorConfig {
  tableName?: string;
}

export interface ConfigDBOptions {
  name: string;
  debug?: boolean;
  client?: string | typeof Client;
  dialect?: string;
  connection?: ConnectionConfigProvider;
  pool?: PoolConfig;
  migrations?: MigratorConfig;
  useNullAsDefault?: boolean;
  postProcessResponse?: (result: any, queryContext: any) => any;
  wrapIdentifier?: (value: string, origImpl: Function) => string;
  log?: LoggerDB;
}
