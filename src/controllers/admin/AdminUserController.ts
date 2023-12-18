import { Request, Response } from "express";
import { getRepository, Not } from "typeorm";
import { validate } from "class-validator";
import { Order } from "../../entity/Order";
import { Product } from "../../entity/Product";
import { User } from "../../entity/User";

import { roles } from '../../utils/enums';
import { getObjectValue, getUniqueSlug } from "../../utils/funs";

class AdminUserController {
  static users = () => getRepository(User)
  static orders = () => getRepository(Order)
  static products = () => getRepository(Product)

  static index = async (req: Request, res: Response): Promise<Response> => {
    const { type, product } = req.query
    let users, productObj;
    try {
      if (product) {
        productObj = await this.products().findOne({
          // where: {
          //   slug: product as string
          // }
        })
      }
    }
    catch (e){
      return res.status(400).send({code: 400, data: 'Unexpected Error'})
    }
    const validType = getObjectValue(roles,type?.toString().toUpperCase())
    if (productObj && validType){
      users = await this.users().find({
        where: {
          role: validType
        },
        relations: ['product']
      })
    }
    else if (validType) {
      users = await this.users().find({
        where: {
          role: validType
        },
        relations: ['product']
      });
    }
    else if(productObj){
      users = await this.users().find({
        relations: ['product']
      })
    }
    else {
      users = await this.users().find();
    }
    return res.status(200).send({'code': 200, 'data': users})
  }
  static create = async (req: Request, res: Response): Promise<Response> => {
    const { name, lastName, nationalCode, role, phoneNumber, product } = req.body;
    let productObj;
    if (!phoneNumber && await this.users().findOne({
      where: {
        phoneNumber: phoneNumber
      }
    })){
      return res.status(400).send({"code": 400, 'data': 'Duplicate PhoneNumber'})
    }
    if (!nationalCode && await this.users().findOne({
      where: {
        nationalCode: nationalCode
      }
    })){
      return res.status(400).send({"code": 400, 'data': 'Duplicate NationalCode'})
    }
    if (!getObjectValue(roles,role)){
      return res.status(400).send({"code": 400, 'data': 'Invalid Role'})
    }
    const user = new User();
    if (product){
      try{
        productObj = await this.products().findOneOrFail({
          // where: {
          //   slug: product as string
          // }
        })
        // user.product = productObj
      }catch(e){
        return res.status(400).send({"code": 400, 'data': 'Invalid Product'})
      }
    }
    user.name = name
    user.lastName = lastName
    user.nationalCode = nationalCode
    user.role = role
    user.phoneNumber = phoneNumber
    user.password = '12345678'
    await user.hashPassword();
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    try {
      await this.users().save(user);
    } catch (e) {
      res.status(409).send({"code": 409});
      return;
    }
    return res.status(201).send({ code: 201, data: user});
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { userId, name, lastName, nationalCode, role, phoneNumber } = req.body;
    let user: User;
    try{
      user = await this.users().findOneOrFail(userId)
    }catch (e){
      return res.status(400).send({"code": 400, 'data': 'Invalid UserId'})
    }
    if (!phoneNumber && await this.users().findOne({
      where: {
        id: Not(userId),
        phoneNumber: phoneNumber
      }
    })){
      return res.status(400).send({"code": 400, 'data': 'Duplicate PhoneNumber'})
    }
    if (!nationalCode && await this.users().findOne({
      where: {
        id: Not(userId),
        nationalCode: nationalCode
      }
    })){
      return res.status(400).send({"code": 400, 'data': 'Duplicate NationalCode'})
    }
    if (!getObjectValue(roles,role)){
      return res.status(400).send({"code": 400, 'data': 'Invalid Status'})
    }
    if (name)
      user.name = name
    if (lastName)
      user.lastName = lastName
    if(nationalCode)
      user.nationalCode = nationalCode
    if (role)
      user.role = role
    if (phoneNumber)
      user.phoneNumber = phoneNumber
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    try {
      await this.users().save(user);
    } catch (e) {
      res.status(409).send({"code": 409});
      return;
    }
    return res.status(200).send({ code: 200, data: user});
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const userId: number = req.body.userId
    let user;
    try {
      user = await this.users().findOneOrFail({
        where: { id: userId },
      });
    } catch (error) {
      res.status(400).send({code: 400, data:"Invalid UserId"});
      return;
    }
    try{
      await this.users().delete(user.id);
    }catch (e){
      res.status(409).send("error try again later");
    }
    return res.status(204).send({code: 204, data: "Success"});
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
    const { workerId, date, fromTime, toTime } = req.body;
    let worker;
    try{
      worker = await this.users().findOneOrFail(workerId)
    }catch (e){
      return res.status(400).send({ code: 400, data: "Invalid WorkerId" })
    }
    return res.status(200).send({code: 200, data: {}})
  }
}

export default AdminUserController;
