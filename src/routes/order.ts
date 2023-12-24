import { Router } from "express";
import AuthController from "../controllers/AuthController";
import OrderController from "../controllers/OrderController";

export class OrderRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();


  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", OrderController.index);
    this.router.post("",this.authController.authenticateJWT, OrderController.create);
    this.router.put("", this.authController.authorizeJWTWorker, OrderController.update);
    this.router.delete("", this.authController.authenticateJWT ,OrderController.delete);
    this.router.get("/status", OrderController.status);
    this.router.get("/cart", OrderController.cart);
    this.router.post("/place", OrderController.place);
    this.router.post("/pay", OrderController.pay);
  }
}
