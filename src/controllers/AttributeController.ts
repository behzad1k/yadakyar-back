import { Request, Response } from "express";
import { getRepository, getTreeRepository } from 'typeorm';
import { Media } from '../entity/Media';
import {Attribute} from "../entity/Attribute";
import { AttributeGroup } from '../entity/AttributeGroup';
import sms from '../utils/sms';

class AttributeController {
  static attributes = () => getRepository(Attribute)
  static medias = () => getRepository(Media)

  static attributeGroups = () => getRepository(AttributeGroup)

  static index = async (req: Request, res: Response): Promise<Response> => {
    const attributes = await getTreeRepository(Attribute).find();
    return res.status(200).send({
      code: 200,
      data: attributes
    })
  }

  static get = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    let attribute = undefined;

    try{
      attribute = await this.attributeGroups().findOneOrFail({
        where: {
          slug: slug
        },
        relations: ['category', 'brand']
      });
      attribute.medias = await this.medias().find({
        where: {

        }
      })
    }catch (e) {
      console.log(e);
      return res.status(400).send({ code: 10000, data: null });
    }

    return res.status(200).send({ code: 200, data: attribute })
  }
}

export default AttributeController;
