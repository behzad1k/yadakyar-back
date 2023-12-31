import { validate } from 'class-validator';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import { getRepository } from 'typeorm';
import config from '../config/config';
import { User } from '../entity/User';

class UserController {
  static users = () => getRepository(User);

  // Authentication
  static signJWT = async (user: {
    id: any;
    role: any
  }, exp?): Promise<string> => {
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      config.jwtSecret,
      {
        expiresIn: exp || config.expiration,
        issuer: config.issuer,
        audience: config.audience,
      },
    );

    return token;
  };

  static signTmpJWT = async (user: {
    id: any;
    code: any
  }, exp?): Promise<string> => {
    const token = jwt.sign(
      {
        userId: user.id,
        code: user.code,
      },
      config.jwtSecret,
      {
        expiresIn: exp || config.expiration,
        issuer: config.issuer,
        audience: config.audience,
      },
    );

    return token;
  };

  static login = async (req: Request, res: Response): Promise<Response> => {
    const {
      phoneNumber,
      password
    } = req.body;

    if (!(phoneNumber)) {
      return res.status(400).send({ 'message': 'Phone number not set' });
    }

    let token = '';
    let user: User;

    try{
      user = await this.users().findOneOrFail({ where: { phoneNumber: phoneNumber } });
    }catch (e){
      return res.status(403).send({ code: 1000, data: "User Not Found"})
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      return res.status(403).send({ code: 1001, data: "Wrong Password"})
    }

    token = await UserController.signJWT({
      id: user.id,
      role: user.role
    });

    try{
      await this.users().update(user.id, { lastEntrance: new Date() });
    }catch (e){
      console.log(e);
    }

    return res.status(200).send({
      code: 200,
      data: {
        token: token,
        role: user.role
      },
    });
  };
  // TODO: auth check doesnt check the token

  static authCheck = async (req: Request, res: Response): Promise<Response> => {
    const {
      token,
      code
    } = req.body;
    if (!token && code) {
      return res.status(400).send({ 'message': 'Bad Request' });
    }
    const tokens: any = jwtDecode(token);
    const userId = tokens.userId;
    const sysCode = tokens.code;
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(userId);
    } catch (e) {
      return res.status(401).send({ 'message': 'User not found' });
    }
    if (sysCode !== code) {
      return res.status(401).send({ 'message': 'Code does not match' });
    }
    const newToken = await UserController.signJWT(user);
    return res.status(200).send({
      code: 200,
      data: {
        user: user,
        token: newToken
      }
    });
  };

  static getUser = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    let user;
    try {
      user = await this.users().findOneOrFail({
        where: {
          id: id
        }
      });
    } catch (e) {
      return res.status(400).send({
        'code': 400,
        'data': 'Invalid User'
      });
    }
    return res.status(200).send({
      'code': 200,
      'data': user
    });
  };
  static changePassword = async (req: Request, res: Response): Promise<Response> => {
    // Get ID from JWT
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    // Get parameters from the body
    const {
      oldPassword,
      newPassword
    } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    // Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({
        where: { id: id },
      });
    } catch (error) {
      res.status(401).send();
    }

    // Check if old password matchs
    // if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
    //   res.status(401).send("Invalid password or wrong email!");
    //   return;
    // }

    // Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    // Hash the new password and save
    // user.hashPassword();
    userRepository.save(user);

    return res.status(204).send();
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    let user;
    try {
      user = await this.users().findOneOrFail({
        where: { id: id },
      });
    } catch (e) {
      return res.status(400).send({
        code: 400,
        data: 'Invalid User'
      });
    }
    const {
      name,
      lastName,
      nationalCode,
      phoneNumber
    } = req.body;
    if (name)
      user.name = name;
    if (lastName)
      user.lastName = lastName;
    if (nationalCode)
      user.nationalCode = nationalCode;
    if (phoneNumber)
      user.phoneNumber = phoneNumber;
    try {
      await this.users().save(user);
    } catch (e) {
      return res.status(409).send({ 'code': 409 });
    }
    return res.status(200).send({
      code: 200,
      user
    });
  };

  static getAddresses = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail({
        where: { id: id },
        relations: ['addresses']
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid UserId'
      });
      return;
    }
    return res.status(200).send({
      code: '200',
      data: user.addresses
    });
  };

  static getWorkerOffs = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
      code: 200,
      data: {}
    });
  };

}

export default UserController;
