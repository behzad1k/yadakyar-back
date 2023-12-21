import { Request, Response } from 'express';
import jwtDecode from 'jwt-decode';
import { getRepository } from 'typeorm';
import { AttributeProduct } from '../entity/AttributeProduct';
import { Order } from '../entity/Order';
import { OrderProduct } from '../entity/OrderProduct';
import { Product } from '../entity/Product';
import { User } from '../entity/User';

class CartController {
  static attributeProducts = () => getRepository(AttributeProduct);
  static products = () => getRepository(Product);
  static orders = () => getRepository(Order);
  static orderProducts = () => getRepository(OrderProduct);
  static users = () => getRepository(User);

  static index = async (req: Request, res: Response): Promise<Response> => {
    if (req.headers.authorization == "Bearer undefined"){
      return res.status(401).send({
        code: 401,
        data: 'Unauthorized access'
      });
    }
    const token: any = jwtDecode(req.headers.authorization || '');
    const id: number = token?.userId;
    let user;
    try {
      user = await this.users().findOneOrFail({ where: { id: id } });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        code: 400,
        data: 'Invalid UserId'
      });
    }

    let cart;
    try {
      cart = await this.orders().findOneOrFail({
        where: {
          userId: user.id,
          inCart: true
        },
        relations: ['products']
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        code: 400,
        data: 'Invalid UserId'
      });
    }

    return res.status(200).send({
      code: 200,
      data: cart || {}
    });
  };

  static updateCount = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    const {
      orderId,
      productId,
      newCount
    } = req.body;
    let user;
    try {
      user = await this.users().findOne({ where: { id: id } });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        code: 400,
        data: 'Invalid UserId'
      });
      return;
    }

    let order;
    try {
      order = await this.orders().findOne({
        where: { id: orderId },
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        code: 400,
        data: 'Invalid OrderId'
      });
      return;
    }

    try {
      if (newCount > 0) {
        await this.orderProducts().update({
          productId: productId,
          orderId: orderId
        }, { count: newCount });
      } else {
        await this.orderProducts().delete({
          productId: productId,
          orderId: orderId
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }

    return res.status(200).send({
      code: 200,
      data: ''
    });
  };

}

export default CartController;
