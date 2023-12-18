import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { AdminAddressRoutes } from "./admin/address";
import { AdminArticleRoutes } from './admin/article';
import { AdminArticleCategoryRoutes } from './admin/articleCategory';
import { AdminAttributeRoutes } from './admin/attribute';
import { AdminAttributeGroupRoutes } from './admin/attributeGroup';
import { AdminAttributeValueRoutes } from './admin/attributeValue';
import { AdminBrandRoutes } from './admin/brand';
import { AdminCategoryRoutes } from './admin/category';
import { AdminDiscountRoutes } from './admin/discount';
import { AdminMenuRoutes } from './admin/menu';
import { AdminOrderRoutes } from "./admin/order";
import { AdminProductRoutes } from "./admin/product";
import { AdminProductGroupRoutes } from './admin/productGroup';
import { AdminTagRoutes } from './admin/tag';
import { AdminUserRoutes } from "./admin/user";

export class AdminRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.use("/address",this.authController.authorizeJWTAdmin,new AdminAddressRoutes().router)
    this.router.use("/discount",this.authController.authorizeJWTAdmin,new AdminDiscountRoutes().router)
    this.router.use("/tag",this.authController.authorizeJWTAdmin,new AdminTagRoutes().router)
    this.router.use("/brand",this.authController.authorizeJWTAdmin,new AdminBrandRoutes().router)
    this.router.use("/menu",this.authController.authorizeJWTAdmin,new AdminMenuRoutes().router)
    this.router.use("/attribute",this.authController.authorizeJWTAdmin,new AdminAttributeRoutes().router)
    this.router.use("/attributeGroup",this.authController.authorizeJWTAdmin,new AdminAttributeGroupRoutes().router)
    this.router.use("/attributeValue",this.authController.authorizeJWTAdmin,new AdminAttributeValueRoutes().router)
    this.router.use("/category",this.authController.authorizeJWTAdmin,new AdminCategoryRoutes().router)
    this.router.use("/product",this.authController.authorizeJWTAdmin,new AdminProductRoutes().router)
    this.router.use("/productGroup",this.authController.authorizeJWTAdmin,new AdminProductGroupRoutes().router)
    this.router.use("/order",this.authController.authorizeJWTAdmin,new AdminOrderRoutes().router)
    this.router.use("/user",this.authController.authorizeJWTAdmin,new AdminUserRoutes().router)
    this.router.use("/article",this.authController.authorizeJWTAdmin,new AdminArticleRoutes().router)
    this.router.use("/articleCategory",this.authController.authorizeJWTAdmin,new AdminArticleCategoryRoutes().router)

  }
}
