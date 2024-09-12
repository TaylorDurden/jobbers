import { verifyGatewayRequest } from '@taylordurden/jobber-shared';
import { Application } from 'express';
import { healthRoutes } from '@users/routes/health';

const BUYER_BASE_PATH = '/api/v1/buyer';
const SELLER_BASE_PATH = '/api/v1/seller';

const useAppRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BUYER_BASE_PATH, verifyGatewayRequest, () => console.log('buyer routers'));
  app.use(SELLER_BASE_PATH, verifyGatewayRequest, () => console.log('seller routers'));
};

export { useAppRoutes };
