import { Request, Response } from 'express';
import { getManager, getRepository, getTreeRepository } from 'typeorm';
import { Attribute } from '../entity/Attribute';
import { AttributeProduct } from '../entity/AttributeProduct';
import { Brand } from '../entity/Brand';
import { Media } from '../entity/Media';

class BrandController {
  static brands = () => getRepository(Brand);
  static attributeProducts = () => getRepository(AttributeProduct);
  static attributes = () => getRepository(Attribute);
  static medias = () => getRepository(Media);

  static index = async (req: Request, res: Response): Promise<Response> => {
    const brands = await getRepository(Brand).find();
    return res.status(200).send({
      code: 200,
      data: brands
    });
  };

  static get = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    let brand = undefined;
    try {
      brand = await this.brands().findOneOrFail({
        where: {
          slug: slug
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(400).send({
        code: 10000,
        data: null
      });
    }

    let attributes = undefined;
    try {
      attributes = await this.attributes().find({});
    } catch (e) {
      console.log(e);
      return res.status(400).send({
        code: 10000,
        data: null
      });
    }

    brand.attributes = attributes;
    let where = '';
    Object.entries(req.query).map(([key, value]: [key: string, value: string[]], index) => {
      if (index == 0) {
        where += 'AND ';
      }
      let valueString = '';
      value.map((e, i) => valueString += 'attributeValueSlug = "' + e + '"' + (i == value.length - 1 ? '' : ' OR '));
      where += `(attributeSlug = "${key}" AND (${valueString}))${Object.entries(req.query).length - 1 == index ? '' : ' OR '}`;
    });
    let products = undefined;
    try {
      products = await getManager().query(`SELECT * FROM attribute_product INNER JOIN product ON product.id = attribute_product.productId INNER JOIN product_group ON product.productGroupId = product_group.id INNER JOIN media ON media.id = product.mediaId WHERE brandId=${brand.id} ${where}`);
    } catch (e) {
      console.log(e);
      return res.status(400).send({
        code: 10000,
        data: null
      });
    }

    brand.products = products;
    return res.status(200).send({
      code: 200,
      data: brand
    });
  };
}

export default BrandController;
