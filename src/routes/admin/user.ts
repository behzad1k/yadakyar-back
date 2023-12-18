/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/unbound-method */
import { Router } from "express";
import AdminProductController from "../../controllers/admin/AdminProductController";
import AdminUserController from "../../controllers/admin/AdminUserController";
import AuthController from "../../controllers/AuthController";
import UserController from "../../controllers/UserController";

export class AdminUserRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("", AdminUserController.index);
    this.router.get("/:id", AdminUserController.single);
    this.router.post("", AdminUserController.create);
    this.router.put("", AdminUserController.update);
    this.router.delete("", AdminUserController.delete);
  }
}
