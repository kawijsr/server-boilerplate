import {
  PingDynamicCommand,
  PingDynamicCommandPost,
} from './health-check.commands';
import {Command, Type} from '@kawijsr/server-node';

class HealthCheckService {
  private static instance: HealthCheckService;

  static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

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

export const healthCheckService = HealthCheckService.getInstance();
