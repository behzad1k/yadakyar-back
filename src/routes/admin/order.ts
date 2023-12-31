import { Router } from "express";
import AdminOrderController from "../../controllers/admin/AdminOrderController";
import OrderController from "../../controllers/OrderController";

export class AdminOrderRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", AdminOrderController.index);
    this.router.get("/:id", AdminOrderController.single);
    this.router.get("/preBill/:id", AdminOrderController.preBillData);
    this.router.post("/preBill/:id", AdminOrderController.preBill);
    this.router.put("/update/:id", AdminOrderController.update);
    this.router.put("/status/:id", AdminOrderController.status);
    this.router.delete("/:id", AdminOrderController.delete);
  }
}
