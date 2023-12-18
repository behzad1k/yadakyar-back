import { Router } from "express";
import AuthController from "../controllers/AuthController";
import CategoryController from "../controllers/CategoryController";

export class CategoryRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", CategoryController.index);
    this.router.get("/:slug", CategoryController.get);
  }
}
