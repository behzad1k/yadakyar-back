import { validate } from 'class-validator';
import { Request, Response } from 'express';
import jwtDecode from 'jwt-decode';
import { getRepository } from 'typeorm';
import { Address } from '../entity/Address';
import { Province } from '../entity/Province';
import { User } from '../entity/User';

class AddressController {
  static users = () => getRepository(User);

  static index = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization || '');
    const id: number = token?.userId;
    let address = undefined;
    try {
      address = await getRepository(Address).findOne({
        where: { userId: id },
        relations: ['province', 'city']
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
      data: address
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      province,
      city,
      phone,
      postal,
      text
    } = req.body;
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    let user;
    try {
      user = await this.users().findOneOrFail({
        where: { id: id },
        relations: ['address']
      });
    } catch (error) {
      return res.status(400).send({
        code: 400,
        data: 'Invalid UserId'
      });
    }

    const address = new Address();
    address.phoneNumber = phone;
    address.postalCode = postal;
    address.cityId = city;
    address.provinceId = province;
    address.text = text;
    address.userId = user.id;
    address.title = 'آدرس ۱';

    const errors = await validate(address);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    const addressRepository = getRepository(Address);

    try {
      await addressRepository.save(address);
    } catch (e) {
      return res.status(409).send({
        code: 409,
        data: 'Something went wrong'
      });
    }
    return res.status(201).send({
      code: 201,
      data: address
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const {
      province,
      city,
      phone,
      postal,
      text
    } = req.body;
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    let address;
    try {
      address = await getRepository(Address).findOneOrFail({
        where: { userId: id },
      });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }

    address.phoneNumber = phone;
    address.postal = postal;
    address.cityId = city;
    address.provinceId = province;
    address.text = text;
    address.userId = id;
    address.title = 'آدرس ۱';

    const errors = await validate(address);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    const addressRepository = getRepository(Address);

    try {
      await addressRepository.save(address);
    } catch (e) {
      return res.status(409).send({
        code: 409,
        data: 'Something went wrong'
      });
    }
    return res.status(201).send({
      code: 200,
      data: address
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const id: number = req.body.AddressId;
    let user: User;
    try {
      user = await this.users().findOneOrFail({
        where: { id: userId },
        relations: ['addresses']
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid UserId'
      });
      return;
    }
    const addressRepository = getRepository(Address);
    let address;
    try {
      address = await addressRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid Id'
      });
      return;
    }
    if (address.userId !== user.id) {
      return res.status(403).send({
        code: 403,
        data: 'Access Forbidden'
      });
    }
    try {
      await addressRepository.delete(id);

    } catch (e) {
      res.status(409).send('error try again later');
    }
    return res.status(204).send();
  };

  static states = async (req: Request, res: Response): Promise<Response> => {
    let states;
    try {
      states = await getRepository(Province).find({ relations: ['cities'] });
    } catch (e) {
      console.log(e);
      res.status(409).send('error try again later');
    }

    return res.status(200).send({
      code: 200,
      data: states
    });
  };

}

export default AddressController;
