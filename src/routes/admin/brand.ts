import { Router } from "express";
import multer from 'multer';
import multerConfig from '../../config/multer';
import AdminAttributeController from '../../controllers/admin/AdminAttributeController';
import AdminBrandController from '../../controllers/admin/AdminBrandController';
import AuthController from "../../controllers/AuthController";

export class AdminBrandRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminBrandController.index);
    this.router.get("/:id", AdminBrandController.single);
    this.router.post("", multer(multerConfig('uploads/catalog')).array('catalogFiles'), AdminBrandController.create);
    this.router.put("/:id", AdminBrandController.update);
    this.router.delete("/:id", AdminBrandController.delete);
    this.router.post("/catalog/:id", multer(multerConfig('uploads/catalog')).single('file'), AdminBrandController.updateCatalog);
    this.router.delete("/catalog/:id", AdminBrandController.deleteCatalog);
  }
}
