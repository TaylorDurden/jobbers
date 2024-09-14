import { config } from '@users/config';
import { winstonLogger } from '@taylordurden/jobber-shared';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createMQConnection } from '@users/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'usersServiceProducer', 'debug');

const publishDirectMessage = async (
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
    log.log('error', 'UsersService publishDirectMessage() method error:', error);
  }
};

export { publishDirectMessage };
