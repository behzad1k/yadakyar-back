import { Router } from "express";
import AuthController from "../controllers/AuthController";
import CartController from "../controllers/CartController";
import SettingController from '../controllers/SettingController';

export class SettingRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/euroPrice", SettingController.euroPrice);
  }
}
