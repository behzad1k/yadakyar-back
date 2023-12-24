import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getManager, getRepository } from 'typeorm';
import { Delivery } from '../../entity/Delivery';
import { Order } from '../../entity/Order';
import { OrderProduct } from '../../entity/OrderProduct';
import { Payment } from '../../entity/Payment';
import { Product } from '../../entity/Product';
import { User } from '../../entity/User';

import { orderStatus } from '../../utils/enums';

class AdminOrderController {
  static users = () => getRepository(User);
  static orders = () => getRepository(Order);
  static products = () => getRepository(Product);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let orders;
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
    // order.status = orderStatus.Assigned;
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

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await getRepository(OrderProduct).delete({ orderId: Number(id) });
      await this.orders().delete(id);
    }catch (e){
      console.log(e);
      return res.status(400).send({ code: 1002, data: "Invalid Id"})
    }

    return res.status(204).send({ code: 200, data: "successful" })
  }

  static preBill = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    let order;
    try {
      order = await getRepository(Order).findOne(id, {
        relations: ['products']
      });
    }catch (e){
      console.log(e);
      return res.status(400).send({ code: 1002, data: "Invalid Id"})
    }
    const data: any = {
      stockProduct: 0,
      stockProductPrice: 0,
      preProduct: 0,
      preProductPrice: 0
    }
    order.products.map((product) => {
      console.log(product.count,product.product );
      if (product.count <= product.product.count){
        data.stockProduct += 1
        data.stockProductPrice += product.count * product.price
      } else {
        data.preProduct += 1
        data.preProductPrice += product.count * product.price
      }
    })

    return res.status(200).send({ code: 200, data: data })

  }
  static preBillCreate = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { deliveryPrice, percent } = req.body;

    let order;
    try {
      order = await getRepository(Order).findOne(id, {
        relations: ['products', 'payments']
      });
    }catch (e){
      console.log(e);
      return res.status(400).send({ code: 1002, data: "Invalid Id"})
    }
    try{
      const payment = new Payment();
      payment.price = order.price * percent / 100;
      payment.isPre = true;
      await getRepository(Payment).save(payment);

      const delivery = new Delivery();
      delivery.price = deliveryPrice;
      await getRepository(Delivery).save(delivery);

      order.payments.push(payment);
      order.delivery = delivery;
      order.status = 3
      await getRepository(Order).save(order)
    } catch (e) {
      console.log(e);
      return res.status(409).send('error try again later');
    }


    return res.status(200).send({ code: 200, data: 'successful' })

  }
}

export default AdminOrderController;
