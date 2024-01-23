import { Router } from "express";
import multerConfig from '../../config/multer';
import AdminProductGroupController from '../../controllers/admin/AdminProductGroupController';
import AuthController from "../../controllers/AuthController";
import multer from "multer"
export class AdminProductGroupRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }
  routes() {

    this.router.get("", AdminProductGroupController.index);
    this.router.get("/:id", AdminProductGroupController.single);
    this.router.post("", multer(multerConfig('uploads/product')).any(), AdminProductGroupController.create);
    this.router.put("/:id", multer(multerConfig('uploads/product')).any(), AdminProductGroupController.update);
    this.router.delete("/:id", AdminProductGroupController.delete);
  }
}
