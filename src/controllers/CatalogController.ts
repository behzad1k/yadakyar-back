import { Request, Response } from 'express';
import { getManager, getRepository, getTreeRepository } from 'typeorm';
import { Attribute } from '../entity/Attribute';
import { AttributeProduct } from '../entity/AttributeProduct';
import { Catalog } from '../entity/Catalog';
import { Media } from '../entity/Media';

class CatalogController {
  static catalogs = () => getRepository(Catalog);
  static attributeProducts = () => getRepository(AttributeProduct);
  static attributes = () => getRepository(Attribute);
  static medias = () => getRepository(Media);

  static index = async (req: Request, res: Response): Promise<Response> => {
    const catalogs = await getRepository(Catalog).find();
    return res.status(200).send({
      code: 200,
      data: catalogs
    });
  };

  static get = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    let catalog = undefined;
    try {
      catalog = await this.catalogs().findOneOrFail({
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

    catalog.attributes = attributes;
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
      products = await getManager().query(`SELECT * FROM attribute_product INNER JOIN product ON product.id = attribute_product.productId INNER JOIN product_group ON product.productGroupId = product_group.id INNER JOIN media ON media.id = product.mediaId WHERE catalogId=${catalog.id} ${where}`);
    } catch (e) {
      console.log(e);
      return res.status(400).send({
        code: 10000,
        data: null
      });
    }

    catalog.products = products;
    return res.status(200).send({
      code: 200,
      data: catalog
    });
  };
}

export default CatalogController;
