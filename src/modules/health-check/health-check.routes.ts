import { Request, Response } from 'express';
import {
  Body,
  Param,
  Query,
  Req,
  Res,
  Route,
  Routes,
} from '@kawijsr/server-node';
import {healthCheckService} from './health-check.service';

@Routes('/api/')
export class HealthCheckRoutes {

  @Route('get', '/')
  public healthCheck() {
    return healthCheckService.healthCheck();
  }

  @Route('get', '/ping')
  public ping() {
    return healthCheckService.ping();
  }

  @Route('get', '/dynamic/:id/ping/:name')
  public pingDynamic(
      @Param('id') id: string, @Param('name') name: string,
      @Query('t') t: string) {
    return healthCheckService.pingDynamic({id, name, t});
  }

  @Route('post', '/dynamic/:id/ping/:name')
  public pingDynamicPost(
      @Param('id') id: string,
      @Param('name') name: string,
      @Query('t') t: string,
      @Body() body: any,
      @Req() request: Request,
      @Res() response: Response,
  ) {
    return {
      id,
      name,
      t,
      body,
    };
  }
}