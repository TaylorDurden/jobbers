import express, { Express } from 'express';
import { start } from '@notifications/server';

import { getLogger } from './helpers';

const log = getLogger('notificationElasticSearchServer', 'debug');

function initilize(): void {
  const app: Express = express();
  start(app);
  log.info('Notification Service Initialized');
}

initilize();
