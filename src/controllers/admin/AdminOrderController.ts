import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getManager, getRepository } from 'typeorm';
import { Order } from '../../entity/Order';
import { Product } from '../../entity/Product';
import { User } from '../../entity/User';

import { orderStatus } from '../../utils/enums';

class AdminOrderController {
  static users = () => getRepository(User);
  static orders = () => getRepository(Order);
  static products = () => getRepository(Product);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let orders,orderCount: number;
    try {
      orders = await this.orders().find({
        where: { inCart: false },
        relations: ['products', 'user']
      });


    } catch (e) {
      console.log(e);
      return res.status(400).send({
        code: 400,
        data: 'Unexpected Error'
      });
    }
    return res.status(200).send({
      code: 200,
      data: orders
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const {
      orderId,
      workerId
    } = req.body;

    let order: Order, user: User
    try {
      order = await this.orders().findOneOrFail({
        where: { id: orderId },
        relations: ['product']
      });


    } catch (error) {
      console.log(error);
      res.status(400).send({
        code: 400,
        data: 'Invalid Order'
      });
      return;
    }
    try {
      user = await this.users().findOneOrFail({
        where: {
          id: workerId,
        }
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid Worker'
      });
      return;
    }
    order.status = orderStatus.Assigned;
    const errors = await validate(order);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.orders().save(order);
    } catch (e) {
      res.status(409).send('error try again later');
      return;
    }
    return res.status(200).send({
      code: 200,
      data: order
    });
  };

}

export default AdminOrderController;
