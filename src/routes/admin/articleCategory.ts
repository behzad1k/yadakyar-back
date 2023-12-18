import { Router } from "express";
import AdminAttributeController from '../../controllers/admin/AdminAttributeController';
import AdminArticleCategoryController from '../../controllers/admin/AdminArticleCategoryController';
import AuthController from "../../controllers/AuthController";

export class AdminArticleCategoryRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminArticleCategoryController.index);
    this.router.get("/:id", AdminArticleCategoryController.single);
    this.router.post("", AdminArticleCategoryController.create);
    this.router.put("/:id", AdminArticleCategoryController.update);
    this.router.delete("/:id", AdminArticleCategoryController.delete);
  }
}
