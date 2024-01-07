import { Router } from "express";
import AuthController from "../controllers/AuthController";
import CatalogController from "../controllers/CatalogController";

export class CatalogRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", CatalogController.index);
    this.router.get("/:slug", CatalogController.get);
  }
}
