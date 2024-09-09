import { SignUp } from '@gateway/controllers/auth/signup';
import express, { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    // localhost:4000/gateway-health
    this.router.post('/auth/signup', SignUp.prototype.create);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
