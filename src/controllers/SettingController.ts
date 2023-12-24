import { Request, Response } from "express";
import { createQueryBuilder, getConnection, getManager, getRepository, getTreeRepository } from 'typeorm';
import { Attribute } from '../entity/Attribute';
import { AttributeProduct } from '../entity/AttributeProduct';
import { Media } from '../entity/Media';
import {Menu} from "../entity/Menu";
import { Setting } from '../entity/Setting';
import sms from '../utils/sms';

class SettingController  {
  static settings = () => getRepository(Setting);
  static euroPrice = async (req: Request, res: Response): Promise<Response> => {
    let result = undefined;
      try{
        result = await this.settings().findOneOrFail({
          where:{
            key: 'derhamPrice'
          }
        })
      }catch (e) {
        return res.status(400).send({
          code: 1003,
          data: "Invalid Key"
        });
      }
    return res.status(200).send({
      code: 200,
      data: result
    })
  }

  static setEuroPrice = async (req: Request, res: Response): Promise<Response> => {
    const { derham } = req.body;

    let result = undefined;
      try{
        result = await this.settings().update({
            key: 'euroPrice'
          },
          {
            value: derham
          }
        )
      }catch (e) {
        return res.status(400).send({
          code: 409,
          data: "Something went wring"
        });
      }
    return res.status(200).send({
      code: 200,
      data: result
    })
  }

}

export default SettingController;
