import { Router } from "express";
import AdminAttributeController from '../../controllers/admin/AdminAttributeController';
import AdminCategoryController from '../../controllers/admin/AdminCategoryController';
import AuthController from "../../controllers/AuthController";

export class AdminCategoryRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminCategoryController.index);
    this.router.get("/:id", AdminCategoryController.single);
    this.router.post("", AdminCategoryController.create);
    this.router.put("/:id", AdminCategoryController.update);
    this.router.delete("/:id", AdminCategoryController.delete);
  }
}
