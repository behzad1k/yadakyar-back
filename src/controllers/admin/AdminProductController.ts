import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository, getTreeRepository } from 'typeorm';
import { Attribute } from '../../entity/Attribute';
import { AttributeProduct } from '../../entity/AttributeProduct';
import { AttributeValue } from '../../entity/AttributeValue';
import { Product } from '../../entity/Product';
import { ProductGroup } from '../../entity/ProductGroup';
import { getUniqueSlug } from '../../utils/funs';

class AdminProductController {
  static products = () => getRepository(Product);
  static productGroups = () => getRepository(ProductGroup);

  static index = async (req: Request, res: Response): Promise<Response> => {
    const { productGroupId } = req.query
    let products = null;
    try {
      let where = {}
      if (productGroupId){
        where['productGroupId'] = productGroupId
      }
      products = await this.products().find({ where: where, relations: ['attributes'] });
    } catch (e) {
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: products
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      price,
      euroPrice,
      wholesomePrice,
      discountPrice,
      status,
      sku,
      productGroupId,
      count,
      attributes
    } = req.body;

    const product = new Product();

    product.price = price;
    product.priceToman = euroPrice;
    product.wholesomePrice = wholesomePrice;
    product.discountPrice = discountPrice;
    product.status = status;
    product.sku = sku;
    product.count = count;
    product.productGroupId = productGroupId;

    const errors = await validate(product);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await this.products().save(product);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }

    // try {
    //   await Promise.all(attributes.map(async (attribute,index) => {
    //     await getRepository(AttributeProduct).insert({
    //       productId: product.id,
    //       attributeSlug: Number(Object.keys(attribute)[index]),
    //       attributeValueSlug: Number(Object.values(attribute)[index]),
    //       categorySlug:
    //     })
    //   }))
    // } catch (e) {
    //   console.log(e);
    //   return res.status(400).send({
    //     code: 1002,
    //     data: 'Invalid Id'
    //   });
    // }
    console.log(product);

    return res.status(201).send({
      code: 200,
      data: product
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      description,
      parentId
    } = req.body;
    let product: Product;

    try {
      product = await this.products().findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    // if (title) {
    //   product.title = title;
    //   product.slug = await getUniqueSlug(this.products(), title);
    // }
    // if (description) {
    //   product.longText = description;
    // }

    const errors = await validate(product);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.products().save(product);
    } catch (e) {
      return res.status(409).send('error try again later');
    }
    return res.status(200).send({
      code: 200,
      data: product
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.products().findOneOrFail({
        where: { id: Number(id) },
      });
    } catch (error) {
      res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
      return;
    }
    try {
      await this.products().delete(id);

    } catch (e) {
      res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(204).send();
  };

  static single = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    let product = null;
    try {
      product = await this.productGroups().findOneOrFail({
        where: {
          id: Number(id),
        },
        relations: ['products']
      });
    } catch (error) {
      res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
      return;
    }
    return res.status(200).send({
      code: 200,
      data: product
    });
  };

}

export default AdminProductController;
