import { Router } from "express";
import AuthController from "../controllers/AuthController";
import TagController from "../controllers/TagController";

export class TagRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", TagController.index);
    this.router.get("/:slug", TagController.get);
  }
}
