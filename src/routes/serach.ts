import { Router } from "express";
import AuthController from "../controllers/AuthController";
import SearchController from "../controllers/SearchController";

export class SearchRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/:query", SearchController.index);
  }
}
