import { Router } from "express";
import AuthController from "../controllers/AuthController";
import CartController from "../controllers/CartController";

export class CartRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", this.authController.authenticateJWT, CartController.index);
    this.router.put("/updateCount", this.authController.authenticateJWT, CartController.updateCount);
  }
}
