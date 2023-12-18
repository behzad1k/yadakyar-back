import { Router } from "express";
import AuthController from "../controllers/AuthController";
import CartController from "../controllers/CartController";

export class CartRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", CartController.index);
    this.router.put("/updateCount", CartController.updateCount);
  }
}
