import {
  PingDynamicCommand,
  PingDynamicCommandPost,
} from './health-check.commands';
import {Command, Type} from '@kawijsr/server-node';
import {Service} from '../../commons/service';

class HealthCheckService {

  healthCheck() {
    return {
      status: 'OK',
    }
  }

  ping() {
    return {
      status: 'Pong',
    };
  }

  @Command()
  pingDynamic(@Type(PingDynamicCommand) cmd: PingDynamicCommand) {
    return cmd;
  }

  @Command()
  pingDynamicPost(@Type(PingDynamicCommandPost) cmd: PingDynamicCommandPost) {
    return 'Ping Dynamic Post';
  }
}

export const healthCheckService = Service.getInstance(HealthCheckService);
