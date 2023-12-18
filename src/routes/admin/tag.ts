import { Router } from "express";
import AdminAttributeController from '../../controllers/admin/AdminAttributeController';
import AdminTagController from '../../controllers/admin/AdminTagController';
import AuthController from "../../controllers/AuthController";

export class AdminTagRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminTagController.index);
    this.router.get("/:id", AdminTagController.single);
    this.router.post("", AdminTagController.create);
    this.router.put("/:id", AdminTagController.update);
    this.router.delete("/:id", AdminTagController.delete);
  }
}
