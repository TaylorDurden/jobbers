import http from 'http';

import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { Channel } from 'amqplib';
import swaggerUi from 'swagger-ui-express';
import { CustomError, IAuthPayload, IErrorResponse } from '@taylordurden/jobber-shared';
import { useAppRoutes } from '@users/routes';
import { config } from '@users/config';
import { checkConnection } from '@users/elasticsearch';
import { getLogger } from '@users/helpers';
import { createMQConnection } from '@users/queues/connection';
import {
  consumeBuyerDirectMessage,
  consumeReviewFanoutMessages,
  consumeSeedGigDirectMessages,
  consumeSellerDirectMessage
} from '@users/queues/user.consumer';
import * as swaggerDocument from '@users/docs/swagger.json'; // 引入swagger.json

const SERVER_PORT = 4003;
const log = getLogger('usersServiceServer', 'debug');

const start = (app: Application): void => {
  securityMiddleware(app);
  standardMiddleware(app);
  addSwaggerDocs(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  usersErrorHandler(app);
  startServer(app);
};

export { start };

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
      const token = req.headers.authorization.split(' ')[1];
      const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
}
const standardMiddleware = (app: Application): void => {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
};

function routesMiddleware(app: Application) {
  useAppRoutes(app);
}

async function startQueues() {
  const userChannel: Channel = (await createMQConnection()) as Channel;
  await consumeBuyerDirectMessage(userChannel);
  await consumeSellerDirectMessage(userChannel);
  await consumeReviewFanoutMessages(userChannel);
  await consumeSeedGigDirectMessages(userChannel);
}

function startElasticSearch() {
  checkConnection();
}

function usersErrorHandler(app: Application) {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `UsersService ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
}

function startServer(app: Application) {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Users server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Users server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'UsersService startServer() method error:', error);
  }
}

function addSwaggerDocs(app: Application) {
  //TODO: use 'tsoa' to generate a swagger.json file
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
