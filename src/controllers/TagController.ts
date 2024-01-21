import { Request, Response } from 'express';
import { getManager, getRepository } from 'typeorm';
import { Attribute } from '../entity/Attribute';
import { AttributeProduct } from '../entity/AttributeProduct';
import { Tag } from '../entity/Tag';
import { Media } from '../entity/Media';

class TagController {
  static tags = () => getRepository(Tag);
  static attributeProducts = () => getRepository(AttributeProduct);
  static attributes = () => getRepository(Attribute);
  static medias = () => getRepository(Media);

  static index = async (req: Request, res: Response): Promise<Response> => {
    const tags = await getRepository(Tag).find();
    return res.status(200).send({
      code: 200,
      data: tags
    });
  };

  static get = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    let tag = undefined;
    try {
      tag = await getRepository(Tag).findOne({
        where: {
          slug: slug
        },
        relations: ['products','products.products'],
      });
    } catch (e) {
      console.log(e);
      return res.status(400).send({
        code: 10000,
        data: null
      });
    }

    return res.status(200).send({
      code: 200,
      data: tag
    });
  };
}

export default TagController;
