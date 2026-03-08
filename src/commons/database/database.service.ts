import knex from 'knex';
import {
  Configurations
} from '@kawijsr/server-node/dist/commons/configurations';
import { ConfigDBOptions } from './database-interfaces';
import { DB } from './database-constants';
import { Utils } from '../utils/utils';
import { Service } from '../service';
import { Validator } from '@kawijsr/server-node';

class DatabaseService {
  private _db: DataSource;

  async connection(options: ConfigDBOptions): Promise<DataSource> {
    if (this._db) {
      return this._db;
    }
    const db = knex(options);
    await db.raw('SET timezone="UTC";');
    console.log('Database connection initialized with UTC timezone');
    this._db = db;
    return db;
  }

  async connectionCheck() {
    const [row] = await this._db.raw('SELECT 1 as one').then((r) => r.rows);
    return row?.one;
  }
}

Service.getInstance(DatabaseService).connection({
  name: DB,
  client: 'pg',
  debug: Configurations.get('DB_DEBUG') === 'true',
  connection: {
    host: Configurations.get('DB_HOST'),
    port: +(Configurations.get('DB_PORT') || 0),
    user: Configurations.get('DB_USER'),
    database: Configurations.get('DB_NAME'),
    password: Configurations.get('DB_PASS'),
  },
  pool: {
    min: 2,
    max: 10,
  },
  useNullAsDefault: true,
  postProcessResponse: (result: any, queryContext) => {
    if (result && result.rows && typeof result.command === 'string') {
      return result;
    }
    if (queryContext?.transform) {
      return Validator.transform(queryContext.transform, result);
    }
    return result;
  },
  wrapIdentifier: (value: string, origImpl: any) =>
    origImpl(Utils.convertToSnakeCase(value)),
}).then(knex => {
  db = knex;
});

export const databaseService = Service.getInstance(DatabaseService);
export let db: DataSource;