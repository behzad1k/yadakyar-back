import { Router } from "express";
import multer from 'multer';
import multerConfig from '../../config/multer';
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
    this.router.put("/derhamPrice", AdminSettingController.setEuroPrice);
    this.router.post("/excel",multer(multerConfig('excel')).single('excel'), AdminSettingController.excel);
    this.router.put("/:key", AdminSettingController.update);
    this.router.delete("/:id", AdminSettingController.delete);
  }
}
