import { validate } from 'class-validator';
import { Request, Response } from 'express';
import jwtDecode from 'jwt-decode';
import { getRepository } from 'typeorm';
import { Address } from '../entity/Address';
import { Discount } from '../entity/Discount';
import { Order } from '../entity/Order';
import { OrderProduct } from '../entity/OrderProduct';
import { Product } from '../entity/Product';
import { User } from '../entity/User';
import { dataTypes, orderStatus } from '../utils/enums';
import { generateCode, getUniqueSlug, omit } from '../utils/funs';

class OrderController {

  static users = () => getRepository(User);
  static orders = () => getRepository(Order);
  static products = () => getRepository(Product);
  static addresses = () => getRepository(Address);
  static discounts = () => getRepository(Discount);
  static index = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const users = await this.users().find();
    let user;
    try {
      user = await this.users().findOneOrFail({
        where: { id: userId },
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid User'
      });
      return;
    }
    let orders;
    try {
      if (user.role === 'WORKER') {
        orders = await this.orders().find({
          relations: ['attributes', 'product', 'address', 'worker']
        });
      } else {
        orders = await this.orders().find({
          where: {
            userId: user.id,
            inCart: false
          },
          relations: ['attributes', 'product', 'address', 'worker']
        });
      }
    } catch (e) {
      console.log(e);
      res.status(400).send({
        code: 400,
        data: 'Unexpected Error'
      });
    }
    return res.status(200).send({
      code: 200,
      data: orders
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const {
      products,
      counts
    } = req.body;

    let user, productObjs = [], discountObj;
    try {
      user = await this.users().findOneOrFail({
        where: { id: userId },
        relations: ['orders']
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid User'
      });
      return;
    }

    let order = undefined;

    try {
      order = await this.orders().findOne({ where: { userId : user.id, inCart: true }})
    }catch (e){
      console.log(e);
    }
    let totalPrice = 0

    let orderProducts = [];
    let currentOrderProducts = [];
    if(order){
      try {
        currentOrderProducts = await getRepository(OrderProduct).find({ orderId: order.id })
        orderProducts = currentOrderProducts;
      } catch (error) {
        res.status(400).send({
          code: 400,
          data: 'Invalid Order'
        });
        return;
      }
    }else{
      order = new Order();
    }

    for (let i = 0; i < products.length; i++) {
      orderProducts.push({'productId': products[i], 'count': counts[i]})
    }

    // if (discount) {
    //   try {
    //     discountObj = await this.discounts().findOneOrFail({ where: { code: discount } });
    //   } catch (error) {
    //     res.status(400).send({
    //       code: 400,
    //       data: 'Invalid discount'
    //     });
    //     return;
    //   }
    //
    //   if (!discountObj.active) {
    //     return res.status(400).send({
    //       code: 400,
    //       data: 'Discount Not Active'
    //     });
    //   }
    //
    //   if (discountObj.userId && discountObj.userId !== userId) {
    //     res.status(400).send({
    //       code: 400,
    //       data: 'Invalid discount User'
    //     });
    //     return;
    //   }
    //
    // }
    // if (discountObj && (discountObj.amount || discountObj.percent)) {
    //   order.discountId = discountObj.id;
    //   totalPrice = discountObj.percent ? totalPrice - (totalPrice * discountObj.percent / 100) : totalPrice - discountObj.amount;
    // }
    try {
      await Promise.all([
        orderProducts.map(async (product) => {
          const item = await getRepository(Product).findOneOrFail({ where: { id: product.productId } });
          totalPrice += item.price * product.count;
        })
      ]);
    }catch(e){
      console.log(e);
    }

    order.price = totalPrice;
    order.user = user;
    order.status = '1';

    const errors = await validate(order);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    try {
      await this.orders().save(order);
      await Promise.all([
        orderProducts?.map(async (orderProduct, index) => {
          const currentOrderProduct = currentOrderProducts.find((currentOrderProduct: any) => currentOrderProduct.orderId == order.id && currentOrderProduct.productId == orderProduct.productId)
          if (currentOrderProduct){
            await getRepository(OrderProduct).update({ id: currentOrderProduct.id },{ count: Number(currentOrderProduct.count) + Number(orderProduct.count) })
          } else {
            await getRepository(OrderProduct).insert({
              orderId: order.id,
              productId: orderProduct.productId,
              count: counts[index]
            });
          }
        })
      ])
    } catch (e) {
      console.log(e);
      res.status(409).send({ 'code': 409 });
      return;
    }
    const finalOrder = omit(['user', 'product'], order);
    return res.status(201).send({
      code: 200,
      data: finalOrder
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    let user, orderObj;
    try {
      user = await this.users().findOneOrFail({
        where: { id: userId },
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid User'
      });
      return;
    }
    const {
      orderId,
      done
    } = req.body;
    try {
      orderObj = await this.orders().findOneOrFail({
        where: {
          id: orderId,
          status: orderStatus.Assigned,
        }
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid Order'
      });
      return;
    }
    if (!done) {
      return res.status(400).send({
        code: 400,
        data: 'Invalid Status'
      });
    }

    orderObj.status = orderStatus.Done;

    try {
      await this.orders().save(orderObj);
    } catch (e) {
      res.status(409).send('error try again later');
      return;
    }
    return res.status(200).send({
      code: 200,
      data: ''
    });
  };

  static cart = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    let user;
    try {
      user = await this.users().findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid UserId'
      });
      return;
    }
    let cart = await this.orders().findOne({
      where: {
        userId: user.id,
        inCart: true
      },
      relations: ['products']
    });
    return res.status(200).send({
      code: 200,
      data: cart
    });
  };

  static place = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;

    let user;
    try {
      user = await this.users().findOneOrFail({
        where: { id: userId },
        relations: ['orders']
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid User'
      });
      return;
    }

    try {
      await this.orders().update({
        userId: userId,
        inCart: true,
      }, {
        inCart: false,
        status: '2',
        code: await getUniqueSlug(this.orders(), generateCode(8, dataTypes.number), 'code')
      });
    } catch (e) {
      console.log(e);
      res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }

    return res.status(200).send({
      code: 200,
      data: ''
    });
  }


  static pay = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    let user, orderObj;
    try {
      user = await this.users().findOneOrFail({
        where: { id: userId },
        relations: ['orders']
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid User'
      });
      return;
    }
    let order;
    try {
      order = await this.orders().find({
        userId: userId,
        inCart: true,
      });

      return res.status(200).send({
        code: 200,
        data: ''
      });
    } catch (e) {
      console.log(e);
      res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
  };
  static delete = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const { orderId } = req.body;
    let user, orderObj;
    try {
      user = await this.users().findOneOrFail({
        where: { id: userId },
        relations: ['orders']
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid User'
      });
      return;
    }
    try {
      orderObj = await this.orders().findOneOrFail(orderId);
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid Order'
      });
      return;
    }
    if (user.id != orderObj.userId) {
      return res.status(403).send({
        code: 403,
        body: 'Access Forbidden'
      });
    }
    try {
      await this.orders().delete(orderObj.id);
    } catch (e) {
      return res.status(409).send('error try again later');
    }
    return res.status(200).send({ code: 200 });
  };
}

export default OrderController;
