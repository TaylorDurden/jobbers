import { winstonLogger } from '@taylordurden/jobber-shared';
import { config } from '@auth/config';

function getLogger(serviceName: string, level: string) {
  return winstonLogger(`${config.ELASTIC_SEARCH_URL}`, serviceName, level);
}
export { getLogger };
