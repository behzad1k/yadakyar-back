import { Router } from "express";
import AuthController from "../controllers/AuthController";
import MenuController from "../controllers/MenuController";

export class MenuRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", MenuController.index);
  }
}
