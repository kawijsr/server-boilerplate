import { Route, Routes, Res } from '@kawijsr/server-node';
import { Response } from 'express';

@Routes('/')
export class RootRoutes {
  @Route('get', '/', {render: true})
  public root(@Res() res: Response) {
    return res.render('index', {
      title: '@kawijsr - Server',
    });
  }
}
