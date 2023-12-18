import { Router } from "express";
import AuthController from "../controllers/AuthController";
import ProductController from "../controllers/ProductController";

export class ProductRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", ProductController.index);
    this.router.get("/:slug", ProductController.get);
  }
}
