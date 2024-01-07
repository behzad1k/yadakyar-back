import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository, Not } from 'typeorm';
import { Address } from '../../entity/Address';
import { Order } from '../../entity/Order';
import { Product } from '../../entity/Product';
import { User } from '../../entity/User';
import { roles } from '../../utils/enums';
import { getObjectValue } from '../../utils/funs';

class AdminUserController {
  static users = () => getRepository(User);
  static orders = () => getRepository(Order);
  static products = () => getRepository(Product);

  static index = async (req: Request, res: Response): Promise<Response> => {
    const {
      type,
      product
    } = req.query;
    let users, productObj;
    const validType = getObjectValue(roles, type?.toString().toUpperCase());
    users = await this.users().find({});
    return res.status(200).send({
      'code': 200,
      'data': users
    });
  };
  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      name,
      lastName,
      nationalCode,
      phoneNumber,
      bankCard,
      password,
      email,
      role,
      status,
      address,
      specialPercent
    } = req.body;

    if (phoneNumber && await this.users().findOne({
      where: {
        phoneNumber: phoneNumber
      }
    })) {
      return res.status(400).send({
        'code': 400,
        'data': 'Duplicate PhoneNumber'
      });
    }

    if (nationalCode && await this.users().findOne({
      where: {
        nationalCode: nationalCode
      }
    })) {
      return res.status(400).send({
        code: 400,
        data: 'Duplicate NationalCode'
      });
    }

    const user = new User();
    user.name = name;
    user.lastName = lastName;
    user.nationalCode = nationalCode;
    user.phoneNumber = phoneNumber;
    user.email = email;
    user.bankCard = bankCard;
    user.password = password;
    user.status = status;
    user.specialPercent = specialPercent
    if (role == 'SUPER_ADMIN' || role == 'USER') {
      user.role = role;
    }

    await user.hashPassword();

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    try {
      await this.users().save(user);

      let newAddress = new Address();

      newAddress.title = 'آدرس ۱';
      newAddress.userId = user.id;
      newAddress.cityId = address.cityId;
      newAddress.provinceId = address.provinceId;
      newAddress.postalCode = address.postalCode;
      newAddress.phoneNumber = address.phone;
      newAddress.text = address.text;

      await getRepository(Address).save(newAddress)
    } catch (e) {
      console.log(e);
      res.status(409).send({
        code: 409,
        data: ''
      });
      return;
    }
    return res.status(201).send({
      code: 201,
      data: user
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params
    const {
      name,
      lastName,
      nationalCode,
      phoneNumber,
      bankCard,
      companyName,
      specialPercent,
      email,
      role,
      status,
      address
    } = req.body;
    let user: User;
    try {
      user = await this.users().findOneOrFail({ where: { id: Number(id) } });
    } catch (e) {
      return res.status(400).send({
        'code': 400,
        'data': 'Invalid UserId'
      });
    }
    if (phoneNumber && await this.users().findOne({
      where: {
        id: Not(Number(id)),
        phoneNumber: phoneNumber
      }
    })) {
      return res.status(400).send({
        'code': 400,
        'data': 'Duplicate PhoneNumber'
      });
    }
    if (nationalCode && await this.users().findOne({
      where: {
        id: Not(Number(id)),
        nationalCode: nationalCode
      }
    })) {
      return res.status(400).send({
        'code': 400,
        'data': 'Duplicate NationalCode'
      });
    }
    // if (!getObjectValue(roles, role)) {
    //   return res.status(400).send({
    //     'code': 400,
    //     'data': 'Invalid Status'
    //   });
    // }
    if (name)
      user.name = name;
    if (lastName)
      user.lastName = lastName;
    if (nationalCode)
      user.nationalCode = nationalCode;
    if (role)
      user.role = role;
    if (phoneNumber)
      user.phoneNumber = phoneNumber;
    if (bankCard)
      user.bankCard = bankCard;
    if (email)
      user.email = email;
    if (status)
      user.status = status;
    if (companyName)
      user.companyName = companyName;
    if (specialPercent)
      user.specialPercent = specialPercent;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    try {

      const newAddress = await getRepository(Address).findOne({ where: { userId: user.id }});
      newAddress.title = 'آدرس ۱';
      newAddress.userId = user.id;
      newAddress.cityId = address.cityId;
      newAddress.provinceId = address.provinceId;
      newAddress.postalCode = address.postalCode;
      newAddress.phoneNumber = address.phone;
      newAddress.text = address.text;

      await getRepository(Address).save(newAddress)
      await this.users().save(user);

    } catch (e) {
      console.log(e);
      res.status(409).send({ 'code': 409 });
      return;
    }
    return res.status(200).send({
      code: 200,
      data: user
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const userId: number = req.body.userId;
    let user;
    try {
      user = await this.users().findOneOrFail({
        where: { id: userId },
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid UserId'
      });
      return;
    }
    try {
      await this.users().delete(user.id);
    } catch (e) {
      res.status(409).send('error try again later');
    }
    return res.status(204).send({
      code: 204,
      data: 'Success'
    });
  };

  static single = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    let user = null;
    try {
      user = await this.users().findOneOrFail({
        where: { id: Number(id) },
      });
    } catch (error) {
      res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
      return;
    }
    return res.status(200).send({
      code: 200,
      data: user
    });
  };

  static workerOff = async (req: Request, res: Response): Promise<Response> => {
    const {
      workerId,
      date,
      fromTime,
      toTime
    } = req.body;
    let worker;
    try {
      worker = await this.users().findOneOrFail(workerId);
    } catch (e) {
      return res.status(400).send({
        code: 400,
        data: 'Invalid WorkerId'
      });
    }
    return res.status(200).send({
      code: 200,
      data: {}
    });
  };
}

export default AdminUserController;
