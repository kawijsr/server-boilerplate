import express from 'express';
import helmet from 'helmet';
import path from 'path';
import cors from 'cors';
import { engine } from 'express-handlebars';
import { Application } from '@kawijsr/server-node';
import { Configurations } from '@kawijsr/server-node/dist/commons/configurations';
import {hbsHelpers} from './commons/handlebars/helpers';

Application.build({ routes: require('./routes') })
  .use(express.json())
  .pipe((app) => {
    if (Configurations.get('NODE_ENV') === 'local') {
      app.use(cors());
      app.use(express.static(path.join(__dirname, '.assets')))
    } else {

      app.use(
        helmet({
          contentSecurityPolicy: {
            directives: {
              imgSrc: [
                "'self'",
                ...(Configurations.get('CORS')?.split(',') || []),
              ],
              scriptSrc: [
                "'self'",
                ...(Configurations.get('CORS')?.split(',') || []),
              ],
              frameSrc: [
                "'self'",
                ...(Configurations.get('CORS')?.split(',') || []),
              ],
              connectSrc: [
                "'self'",
                ...(Configurations.get('CORS')?.split(',') || []),
              ],
            },
          },
        }),
      );
    }

  app.engine('hbs', engine({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: hbsHelpers,
  }));
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, 'views'));

  if (Configurations.get('NODE_ENV') !== 'local') {
    app.enable('view cache');
  }
})
  .start(() => {
    console.log(`Server started on port http://localhost:${Configurations.get('PORT')}`);
  });
