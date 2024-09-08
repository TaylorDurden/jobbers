import { healthRoutes } from '@auth/routes/health';
import { Application } from 'express';

export function appRoutes(app: Application): void {
  app.use('', healthRoutes());
}
