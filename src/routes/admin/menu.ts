import { Router } from "express";
import AdminAttributeController from '../../controllers/admin/AdminAttributeController';
import AdminMenuController from '../../controllers/admin/AdminMenuController';
import AuthController from "../../controllers/AuthController";

export class AdminMenuRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminMenuController.index);
    this.router.get("/:id", AdminMenuController.single);
    this.router.post("", AdminMenuController.create);
    this.router.put("/:id", AdminMenuController.update);
    this.router.delete("/:id", AdminMenuController.delete);
  }
}
