import { Router } from "express";
import AdminProductController from '../../controllers/admin/AdminProductController';

export class AdminProductRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminProductController.index);
    this.router.get("/:id", AdminProductController.single);
    this.router.post("", AdminProductController.create);
    this.router.put("/:id", AdminProductController.update);
    this.router.delete("/:id", AdminProductController.delete);
  }
}
