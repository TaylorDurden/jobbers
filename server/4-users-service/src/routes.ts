import { verifyGatewayRequest } from '@taylordurden/jobber-shared';
import { Application } from 'express';
import { healthRoutes } from '@users/routes/health';
import { buyerRoutes } from '@users/routes/buyer';
import { sellerRoutes } from '@users/routes/seller';

const BUYER_BASE_PATH = '/api/v1/buyer';
const SELLER_BASE_PATH = '/api/v1/seller';

const useAppRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BUYER_BASE_PATH, verifyGatewayRequest, buyerRoutes());
  app.use(SELLER_BASE_PATH, verifyGatewayRequest, sellerRoutes());
};

export { useAppRoutes };
