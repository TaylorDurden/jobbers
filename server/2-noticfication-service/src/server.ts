import http from 'http';

import { winstonLogger } from '@taylordurden/jobber-shared';
import { Logger } from 'winston';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { config } from '@notifications/config';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';

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
  await consumeOrderEmailMessages(emailChannel);

  await emailChannel.assertExchange('jobber-email-notification', 'direct');
  const content = JSON.stringify({ name: 'taylor', service: 'auth notification-service' });
  emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(content));

  await emailChannel.assertExchange('jobber-order-notification', 'direct');
  const content1 = JSON.stringify({ name: 'order1', service: 'order notification-service' });
  emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(content1));
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
