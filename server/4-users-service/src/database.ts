import mongoose from 'mongoose';
import { config } from '@users/config';
import { getLogger } from '@users/helpers';

const log = getLogger('usersMongooseServer', 'debug');

const mongooseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${config.DATABASE_URL}`);
    log.info('Users service successfully connected to mongoose database.');
  } catch (error) {
    log.log('error', 'UsersService databaseConnection() method error:', error);
  }
};

export { mongooseConnection };
