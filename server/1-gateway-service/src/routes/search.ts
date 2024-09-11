import express, { Router } from 'express';
import { Search } from '@gateway/controllers/auth/search';

class SearchRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/auth/search/gigs/:from/:size/:type', Search.prototype.gigs);
    this.router.get('/auth/search/gigs/:gigId', Search.prototype.gigById);
    return this.router;
  }
}

export const searchRoutes: SearchRoutes = new SearchRoutes();
