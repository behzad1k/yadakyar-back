import { Router } from "express";
import AuthController from "../controllers/AuthController";
import BrandController from '../controllers/BrandController';
import CatalogController from "../controllers/CatalogController";

export class BrandRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", BrandController.index);
    this.router.get("/:slug", BrandController.get);
  }
}
