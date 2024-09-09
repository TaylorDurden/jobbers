import { Application } from 'express';
import { healthRoutes } from '@auth/routes/health';
import { authRoutes } from '@auth/routes/auth';
import { verifyGatewayRequest } from '@taylordurden/jobber-shared';

const BASE_PATH = '/api/v1/auth';

export function appRoutes(app: Application): void {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
  // app.use(BASE_PATH, (req: Request) => {
  //   console.log(req.headers);
  // });
}
