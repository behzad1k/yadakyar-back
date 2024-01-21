import { Request, Response } from "express";
import jwtDecode from 'jwt-decode';
import { getRepository, getTreeRepository } from 'typeorm';
import { AttributeProduct } from '../entity/AttributeProduct';
import { Media } from '../entity/Media';
import {Product} from "../entity/Product";
import { ProductFavorite } from '../entity/ProductFavorite';
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
        relations: ['category', 'brand', 'medias', 'products.attributes.attribute', 'products.attributes.attributeValue']
      });
    }catch (e) {
      console.log(e);
      return res.status(400).send({ code: 1000, data: null });
    }
    const ats = {}
    product.products[0].attributes?.map((e) => {
      ats[e.attribute.title] = []
    })

    await Promise.all(product.products.map(async (e) => {
      e.attributes.map((attributeProduct) => !ats[attributeProduct.attribute.title].includes((attributeProduct.attributeValue.title)) && ats[attributeProduct.attribute.title].push(attributeProduct.attributeValue.title))
    }));

    product.attributes = ats

    return res.status(200).send({ code: 200, data: product })
  }

  static favorites = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const id: number = token.userId;
    let favorites;
    try {
      favorites = await getRepository(ProductFavorite).find({
        where: {
          userId: id
        },
        relations: ['product.productGroup']
      });
    } catch (e) {
      return res.status(400).send({
        code: 400,
        data: 'Invalid User'
      });
    }
    return res.status(200).send({
      code: 200,
      data: favorites
    });
  }
  static createFavorite = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const { id } = req.params
    let favorite;
    try {
      favorite = await getRepository(ProductFavorite).findOne({
        where: {
          userId: userId,
          productId: Number(id)
        }
      });
      if (favorite){
        return res.status(400).send({
          code: 1004,
          data: 'Duplicate Favorite'
        });
      } else {
        await getRepository(ProductFavorite).insert({
          userId: userId,
          productId: Number(id)
        });
      }
    } catch (e) {
      return res.status(400).send({
        code: 400,
        data: 'Invalid User'
      });
    }

    return res.status(200).send({
      code: 200,
      data: 'Successfull'
    });
  }
  static deleteFavorite = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const { id } = req.params
    let favorite;
    try {
      favorite = await getRepository(ProductFavorite).findOne({
        where: {
          userId: userId,
          productId: Number(id)
        }
      });
      if (!favorite){
        return res.status(400).send({
          code: 1002,
          data: 'Invalid Favorite ID'
        });
      } else {
        await getRepository(ProductFavorite).delete({
          userId: userId,
          productId: Number(id)
        });
      }
    } catch (e) {
      return res.status(400).send({
        code: 400,
        data: 'Invalid User'
      });
    }

    return res.status(200).send({
      code: 200,
      data: 'Successfull'
    });
  }

}

export default ProductController;
