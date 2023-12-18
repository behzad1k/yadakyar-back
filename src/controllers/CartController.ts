import { Request, Response } from "express";
import jwtDecode from 'jwt-decode';
import { createQueryBuilder, getConnection, getManager, getRepository, getTreeRepository } from 'typeorm';
import { Attribute } from '../entity/Attribute';
import { AttributeProduct } from '../entity/AttributeProduct';
import { Media } from '../entity/Media';
import { Order } from '../entity/Order';
import { OrderProduct } from '../entity/OrderProduct';
import { Product } from '../entity/Product';
import { User } from '../entity/User';
import sms from '../utils/sms';

class CartController {
  static attributeProducts = () => getRepository(AttributeProduct)
  static products = () => getRepository(Product)
  static orders = () => getRepository(Order)
  static orderProducts = () => getRepository(OrderProduct)
  static users = () => getRepository(User)

  static index = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    let cart;
    try {
      cart = await this.orders().findOne({
        relations: ['products']
      })
    } catch (error) {
      console.log(error);
      res.status(400).send({
        code: 400,
        data: 'Invalid UserId'
      });
      return;
    }


    return res.status(200).send({ code: 200, data: cart })
  }
  static updateCount = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    const { orderId, productId, newCount } = req.body;
    let user;
    try {
      user = await this.users().findOne({ where: { id: id } })
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
      })
    } catch (error) {
      console.log(error);
      res.status(400).send({
        code: 400,
        data: 'Invalid OrderId'
      });
      return;
    }

    try {
      if (newCount > 0){
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
      return res.status(409).send({code: 409, data: "error try again later"});
    }


    return res.status(200).send({ code: 200, data: "" })
  }

}

export default CartController;
