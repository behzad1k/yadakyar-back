import { Router } from "express";
import AuthController from "../controllers/AuthController";
import ProductController from "../controllers/ProductController";

export class ProductRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", ProductController.index);
    this.router.get("/:slug", ProductController.get);
    this.router.get("/favorites/all", this.authController.authenticateJWT, ProductController.favorites);
    this.router.post("/favorite/:id", this.authController.authenticateJWT, ProductController.createFavorite);
    this.router.delete("/favorite/:id", this.authController.authenticateJWT, ProductController.deleteFavorite);
  }
}
