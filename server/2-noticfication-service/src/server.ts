import http from 'http';

import { winstonLogger } from '@taylordurden/jobber-shared';
import { Logger } from 'winston';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { config } from '@notifications/config';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages } from './queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes());

  startQueues();
  startElasticsearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  const exchangeName = 'jobber-email-notification';
  const routingKey = 'auth-email';

  await emailChannel.assertExchange(exchangeName, 'direct');
  const content = JSON.stringify({ name: 'taylor', service: 'notification-service' });
  emailChannel.publish(exchangeName, routingKey, Buffer.from(content));
}

function startElasticsearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
