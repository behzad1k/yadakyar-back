import { Request, Response } from "express";
import { getRepository, getTreeRepository } from 'typeorm';
import { Media } from '../entity/Media';
import {Product} from "../entity/Product";
import { ProductGroup } from '../entity/ProductGroup';
import sms from '../utils/sms';

class ProductController {
  static products = () => getRepository(Product)
  static medias = () => getRepository(Media)

  static productGroups = () => getRepository(ProductGroup)

  static index = async (req: Request, res: Response): Promise<Response> => {
    const products = await getTreeRepository(Product).findTrees();
    return res.status(200).send({
      code: 200,
      data: products
    })
  }

  static get = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    let product = undefined;

    try{
      product = await this.productGroups().findOneOrFail({
        where: {
          slug: slug
        },
        relations: ['category', 'brand']
      });
      product.medias = await this.medias().find({
        where: {
          morphType: 'ProductGroup',
          morphId: product.id
        }
      })
    }catch (e) {
      console.log(e);
      return res.status(400).send({ code: 10000, data: null });
    }

    return res.status(200).send({ code: 200, data: product })
  }
}

export default ProductController;
