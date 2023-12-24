import { Router } from "express";
import AdminAttributeController from '../../controllers/admin/AdminAttributeController';
import AdminSettingController from '../../controllers/admin/AdminSettingController';
import AuthController from "../../controllers/AuthController";

export class AdminSettingRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminSettingController.index);
    this.router.get("/:key", AdminSettingController.single);
    this.router.post("", AdminSettingController.create);
    this.router.put("/:key", AdminSettingController.update);
    this.router.delete("/:id", AdminSettingController.delete);
  }
}
