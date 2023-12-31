import { validate } from 'class-validator';
import { Request, Response } from 'express';
import jwtDecode from 'jwt-decode';
import { getRepository } from 'typeorm';
import { Address } from '../entity/Address';
import { Discount } from '../entity/Discount';
import { Order } from '../entity/Order';
import { OrderProduct } from '../entity/OrderProduct';
import { OrderStatus } from '../entity/OrderStatus';
import { Payment } from '../entity/Payment';
import { Product } from '../entity/Product';
import { Setting } from '../entity/Setting';
import { User } from '../entity/User';
import { dataTypes, orderStatus } from '../utils/enums';
import { generateCode, getTomanPrice, getUniqueSlug, omit } from '../utils/funs';

class OrderController {

  static users = () => getRepository(User);
  static orders = () => getRepository(Order);
  static products = () => getRepository(Product);
  static orderProducts = () => getRepository(OrderProduct);
  static addresses = () => getRepository(Address);
  static discounts = () => getRepository(Discount);
  static index = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization || '');
    const userId: number = token?.userId;
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
      // @ts-ignore
      orders = await this.orders().find({ where: { userId: user.id, inCart: false }, relations: { orderStatuses: true, delivery: true, products: { product: { productGroup: { category: true } } }, address: true, } });
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
        relations: ['orders', 'address']
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
      order = await this.orders().findOne({
        where: {
          userId: user.id,
          inCart: true
        }
      });
      if (!order) {
        console.log('here');
        order = await this.orders().insert({
          price: 0,
          userId: user.id,
          status: 1,
          priceToman: 0,
          addressId: user?.address?.id
        })
        order = order.generatedMaps[0]
      }
    } catch (e) {
      console.log(e);
    }

    try {
      await Promise.all(
      products.map(async (product, index) => {
        const orderProduct = await getRepository(OrderProduct).findOne({
          where: {
            orderId: order.id,
            productId: product
          }
        });

        if (orderProduct){
          const newCount = Number(orderProduct.count) + Number(counts[index]);
          await getRepository(OrderProduct).update(orderProduct.id, { count: newCount });
        } else {
          const productObj = await getRepository(Product).findOne({ where: { id: product }})
          await getRepository(OrderProduct).insert({
            orderId: order.id,
            productId: product,
            count: counts[index],
            price: productObj.price,
            priceToman: await getTomanPrice(getRepository(Setting), productObj.price)
          });
        }
      }));
    }catch (e){
      console.log(e);
    }

    // let currentOrderProducts = [];
    // if (order) {
    //   try {
    //     currentOrderProducts = await getRepository(OrderProduct).find({ orderId: order.id });
    //     orderProducts = currentOrderProducts;
    //   } catch (error) {
    //     res.status(400).send({
    //       code: 400,
    //       data: 'Invalid Order'
    //     });
    //     return;
    //   }
    // } else {
    //   order = new Order();
    // }
    //
    // for (let i = 0; i < products.length; i++) {
    //   orderProducts.push({
    //     'productId': products[i],
    //     'count': counts[i]
    //   });
    // }

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
    // const prices: number[] = [];
    // try {
    //   await Promise.all([
    //     orderProducts.map(async (product, index) => {
    //       const item = await getRepository(Product).findOneOrFail({ where: { id: product.productId } });
    //       prices[index] = item.price;
    //       totalPrice += item.price * product.count;
    //     })
    //   ]);
    // } catch (e) {
    //   console.log(e);
    // }
    let orderProducts = [];
    try{
      orderProducts = await getRepository(OrderProduct).find({ where: { orderId: order.id } })
    }catch (e){
      return res.status(400).send({ code: 409, data: 'Something went wrong'})
    }

    let totalPrice = 0;

    orderProducts.map((orderProduct, index) => {
      totalPrice += orderProduct.count * orderProduct.price
    })

    try {
      const tomanPrice = await getTomanPrice(getRepository(Setting), totalPrice)
      await this.orders().update(order.id, { price: totalPrice, priceToman: tomanPrice});
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
        status: 2,
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
  };

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
        where: {
          userId: userId,
          inCart: true,
        }
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

  static status = async (req: Request, res: Response): Promise<Response> => {
    const orderStatuses = await getRepository(OrderStatus).find();
    return res.status(200).send({
      code: 200,
      data: orderStatuses
    })
  }

  static billCreate = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const { bank, code, date } = req.body;
    const { id } = req.params;
    let order;
    try {
      order = await this.orders().findOne({ where: { id: Number(id) }, relations: ['payments'] });

      const payment = order.payments.find((e) => e.isPre == (order.status == 3))
      payment.bank = bank;
      payment.code = code;
      payment.date = date;
      await getRepository(Payment).save(payment);

      order.status = order.status == 3 ? 4 : 7;
      await getRepository(Order).save(order);

      return res.status(200).send({
        code: 200,
        data: 'Successful'
      });
    } catch (e) {
      console.log(e);
      res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
  }

  static cancel = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await getRepository(Order).update({
        id: Number(id)
      }, {
        status: 10
      });
    } catch (e) {
      console.log(e);
      return res.status(409).send('error try again later');
    }

    return res.status(200).send({
      code: 200,
      data: 'Successful'
    });
  };
}

export default OrderController;
