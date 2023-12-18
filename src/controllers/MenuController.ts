import { Request, Response } from "express";
import { createQueryBuilder, getConnection, getManager, getRepository, getTreeRepository } from 'typeorm';
import { Attribute } from '../entity/Attribute';
import { AttributeProduct } from '../entity/AttributeProduct';
import { Media } from '../entity/Media';
import {Menu} from "../entity/Menu";
import sms from '../utils/sms';

class MenuController {

  static index = async (req: Request, res: Response): Promise<Response> => {
    const menus = await getTreeRepository(Menu).findTrees();
    return res.status(200).send({
      code: 200,
      data: menus
    })
  }

}

export default MenuController;
