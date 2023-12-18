import { Router } from "express";
import AdminAddressController from "../../controllers/admin/AdminAddressController";
import AuthController from "../../controllers/AuthController";

export class AdminAddressRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {

    // Get own user
    this.router.get("/", AdminAddressController.index);
    this.router.post("/create", AdminAddressController.create);
    this.router.put("/update", AdminAddressController.update);
    this.router.delete("/delete", AdminAddressController.delete);
  }
}
