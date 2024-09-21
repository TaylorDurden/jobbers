import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createMQConnection } from '@order/queues/connection';
import { config } from '@order/config';
import { winstonLogger } from '@taylordurden/jobber-shared';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'orderServiceProducer', 'debug');

export const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createMQConnection()) as Channel;
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'OrderService OrderServiceProducer publishDirectMessage() method:', error);
  }
};
