import {
  PingDynamicCommand,
  PingDynamicCommandPost,
} from './health-check.commands';
import {Command, Type} from '@kawijsr/server-node';
import * as packageJson from '../../../package.json';
import { Service } from '../../commons/service';
import { databaseService } from '../../commons/database/database.service';

class HealthCheckService {

  async healthCheck() {
    const dbConnectionStatus: number = await databaseService.connectionCheck();
    return {
      status: 'ok',
      version: packageJson.version,
      dbStatus: dbConnectionStatus ? 'active' : 'inactive',
    };
  }

  ping() {
    return {
      status: 'Pong',
    };
  }

  @Command()
  pingDynamic(@Type() cmd: PingDynamicCommand) {
    return cmd;
  }

  @Command()
  pingDynamicPost(@Type() cmd: PingDynamicCommandPost) {
    return 'Ping Dynamic Post';
  }
}

export const healthCheckService = Service.getInstance(HealthCheckService);
