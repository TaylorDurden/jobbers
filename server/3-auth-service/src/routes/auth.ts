import express, { Router } from 'express';
import { create } from '@auth/controllers/signup';
import { signIn } from '@auth/controllers/signin';
import { verifyEmail } from '@auth/controllers/verify-email';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/signup', create);
  router.post('/signin', signIn);
  router.post('/verify-email', verifyEmail);

  return router;
}
