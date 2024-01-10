import { Request, Response } from 'express';
import { getManager, getRepository, getTreeRepository } from 'typeorm';
import { Attribute } from '../entity/Attribute';
import { AttributeProduct } from '../entity/AttributeProduct';
import { Category } from '../entity/Category';
import { Media } from '../entity/Media';
import { ProductGroup } from '../entity/ProductGroup';

class CategoryController {
  static categories = () => getRepository(Category);
  static attributeProducts = () => getRepository(AttributeProduct);
  static attributes = () => getRepository(Attribute);
  static medias = () => getRepository(Media);

  static index = async (req: Request, res: Response): Promise<Response> => {
    const categories = await getTreeRepository(Category).findTrees();
    return res.status(200).send({
      code: 200,
      data: categories
    });
  };

  static get = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    let category = undefined;
    try {
      category = await this.categories().findOneOrFail({
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

    category.attributes = attributes;
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
      products = await getManager().query(`SELECT Distinct product.id, product.*, media.* FROM attribute_product INNER JOIN product ON product.id = attribute_product.productId INNER JOIN product_group ON product.productGroupId = product_group.id INNER JOIN media ON media.id = product.mediaId WHERE categoryId=${category.id} ${where}`);
    } catch (e) {
      console.log(e);
      return res.status(400).send({
        code: 10000,
        data: null
      });
    }

    category.products = products;

    return res.status(200).send({
      code: 200,
      data: category
    });
  };
}

export default CategoryController;
