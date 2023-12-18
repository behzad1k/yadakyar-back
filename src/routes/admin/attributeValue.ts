import { Router } from "express";
import AdminAttributeValueController from '../../controllers/admin/AdminAttributeValueController';
import AuthController from "../../controllers/AuthController";

export class AdminAttributeValueRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminAttributeValueController.index);
    this.router.get("/:id", AdminAttributeValueController.single);
    this.router.post("", AdminAttributeValueController.create);
    this.router.put("/:id", AdminAttributeValueController.update);
    this.router.delete("/:id", AdminAttributeValueController.delete);
  }
}
