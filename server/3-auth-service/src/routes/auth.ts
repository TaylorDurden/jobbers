import express, { Router } from 'express';
import { create } from '@auth/controllers/signup';
import { signIn } from '@auth/controllers/signin';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/signup', create);
  router.post('/signin', signIn);

  return router;
}
