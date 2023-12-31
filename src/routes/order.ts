import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import OrderController from '../controllers/OrderController';

export class OrderRoutes {
  public router: Router;
  public authController: AuthController = new AuthController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get('', this.authController.authenticateJWT, OrderController.index);
    this.router.post('', this.authController.authenticateJWT, OrderController.create);
    this.router.put('', this.authController.authorizeJWTWorker, OrderController.update);
    this.router.delete('', this.authController.authenticateJWT, OrderController.delete);
    this.router.get('/status', OrderController.status);
    this.router.get('/cart', this.authController.authenticateJWT, OrderController.cart);
    this.router.post('/place', this.authController.authenticateJWT, OrderController.place);
    this.router.post('/bill/:id', this.authController.authenticateJWT, OrderController.billCreate);
    this.router.post('/cancel/:id', this.authController.authenticateJWT, OrderController.cancel);
    this.router.post('/pay', this.authController.authenticateJWT, OrderController.pay);
  }
}
