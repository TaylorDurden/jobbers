import http from 'http';

import 'express-async-errors';
import { getLogger } from '@auth/helpers';
import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import { config } from '@auth/config';
import { verify } from 'jsonwebtoken';
import { CustomError, IAuthPayload, IErrorResponse } from '@taylordurden/jobber-shared';
import compression from 'compression';
import { checkConnection, createIndex } from '@auth/elasticsearch';
import { createConnectionMQ } from '@auth/queues/connection';
import { appRoutes } from '@auth/routes';
import { Channel } from 'amqplib';

const SERVER_PORT = 4002;
const log = getLogger('authenticationServer', 'debug');

export let authChannel: Channel;

export function start(app: Application): void {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  authErrorHandler(app);
  startServer(app);
}

function securityMiddleware(app: Application) {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: config.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      // ['Bearer', '12312daweqwe123ed1wqeqd12']
      const token = req.headers.authorization.split(' ')[1];
      const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
}

function standardMiddleware(app: Application) {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
}

function routesMiddleware(app: Application) {
  appRoutes(app);
}

async function startQueues(): Promise<void> {
  authChannel = (await createConnectionMQ()) as Channel;
}

function startElasticSearch() {
  checkConnection();
  createIndex('gigs');
}

function authErrorHandler(app: Application) {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CustomError) {
      log.log('error', `AuthService ${error.comingFrom}:`, error.serializeErrors());
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
}

function startServer(app: Application) {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Authentication server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Authentication server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'AuthService startServer() method error:', error);
  }
}
