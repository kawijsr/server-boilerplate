import express from 'express';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import path from 'path';
import { engine } from 'express-handlebars';
import { Application } from '@kawijsr/server-node';
import {
  Configurations,
} from '@kawijsr/server-node/dist/commons/configurations';
import { hbsHelpers } from './commons/handlebars/helpers';
import { defaultErrorHandler } from './commons/log.handler';
import packageJson from '../package.json';

Application.build({ routes: require('./routes') }).
    use(express.json()).
    use(express.urlencoded({ extended: true })).
    pipe((app) => {
      const isLocalEnv = Configurations.get('NODE_ENV') === 'local';
      if (isLocalEnv) {
        app.use(express.static(path.join(__dirname, '.assets')));
      }

      app.use(
          helmet({
            contentSecurityPolicy: {
              directives: {
                imgSrc: [
                  '\'self\'',
                  ...(Configurations.get('CORS')?.split(',') || []),
                ],
                scriptSrc: [
                  '\'self\'',
                  isLocalEnv ? '\'unsafe-inline\'' : '',
                  ...(Configurations.get('CORS')?.split(',') || []),
                ],
                frameSrc: [
                  '\'self\'',
                  ...(Configurations.get('CORS')?.split(',') || []),
                ],
                connectSrc: [
                  '\'self\'',
                  ...(Configurations.get('CORS')?.split(',') || []),
                ],
              },
            },
          }),
      );
      app.use((req, res, next) => {
        res.setHeader(
            'Permissions-Policy',
            'geolocation=(self), payment=()',
        );
        next();
      });

      app.set('trust proxy', 1)
      app.use(cookieSession({
        name: '__SESSION__',
        keys: Configurations.get('COOKIE_SESSION_SECRET_KEYS').split(','),
        secure: !isLocalEnv,
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 1000 * 1000,
      }));

      app.engine('hbs', engine({
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        extname: '.hbs',
        partialsDir: path.join(__dirname, 'views', 'partials'),
        helpers: hbsHelpers,
      }));
      app.set('view engine', 'hbs');
      app.set('views', path.join(__dirname, 'views'));

      if (!isLocalEnv) {
        app.enable('view cache');
      }
    }).
    start(async (app) => {
      app.use(defaultErrorHandler);
      console.log(`verson: ${packageJson.version}`)
      console.log(
          `Server started on port http://localhost:${Configurations.get('PORT')}`);
    });
