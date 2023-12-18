import { Router } from "express";
import AdminAttributeGroupController from '../../controllers/admin/AdminAttributeGroupController';
import AuthController from "../../controllers/AuthController";

export class AdminAttributeGroupRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminAttributeGroupController.index);
    this.router.get("/:id", AdminAttributeGroupController.single);
    this.router.post("", AdminAttributeGroupController.create);
    this.router.put("/:id", AdminAttributeGroupController.update);
    this.router.delete("/:id", AdminAttributeGroupController.delete);
  }
}
