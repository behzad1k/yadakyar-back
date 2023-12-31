import { Router } from "express";
import AuthController from "../controllers/AuthController";
import ArticleController from "../controllers/ArticleController";

export class ArticleRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", ArticleController.index);
    this.router.get("/:slug", ArticleController.get);
  }
}
