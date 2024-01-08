import { Router } from "express";
import multer from 'multer';
import multerConfig from '../../config/multer';
import AdminAttributeController from '../../controllers/admin/AdminAttributeController';
import AdminArticleController from '../../controllers/admin/AdminArticleController';
import AuthController from "../../controllers/AuthController";

export class AdminArticleRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminArticleController.index);
    this.router.get("/:id", AdminArticleController.single);
    this.router.post("",multer(multerConfig('uploads/article')).single('image'), AdminArticleController.create);
    this.router.put("/:id", AdminArticleController.update);
    this.router.delete("/:id", AdminArticleController.delete);
  }
}
