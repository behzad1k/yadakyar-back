import { Router } from "express";
import AuthController from "../controllers/AuthController";
import AttributeController from "../controllers/AttributeController";

export class AttributeRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", AttributeController.index);
    this.router.get("/:slug", AttributeController.get);
  }
}
