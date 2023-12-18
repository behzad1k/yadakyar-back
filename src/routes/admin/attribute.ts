import { Router } from "express";
import AdminAttributeController from '../../controllers/admin/AdminAttributeController';
import AuthController from "../../controllers/AuthController";

export class AdminAttributeRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminAttributeController.index);
    this.router.get("/:id", AdminAttributeController.single);
    this.router.post("", AdminAttributeController.create);
    this.router.put("/:id", AdminAttributeController.update);
    this.router.delete("/:id", AdminAttributeController.delete);
  }
}
