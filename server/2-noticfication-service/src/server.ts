import http from 'http';

import { Application } from 'express';
import { IEmailMessageDetails } from '@taylordurden/jobber-shared';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';
import { getLogger } from '@notifications/helpers';
import { config } from '@notifications/config';

const SERVER_PORT = 4001;
const log = getLogger('notificationServer', 'debug');

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

  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=12sad13ed1we`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: `${config.SENDER_EMAIL}`,
    resetLink: verificationLink,
    username: 'Taylor',
    template: 'forgotPassword'
  };
  await emailChannel.assertExchange('jobber-email-notification', 'direct');
  const emailContent = JSON.stringify(messageDetails);
  emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(emailContent));

  await emailChannel.assertExchange('jobber-order-notification', 'direct');
  const orderContent = JSON.stringify({ name: 'order1', service: 'order notification-service' });
  emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(orderContent));
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
