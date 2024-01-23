import { validate } from 'class-validator';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { getRepository } from 'typeorm';
import { AttributeGroup } from '../../entity/AttributeGroup';
import { AttributeProduct } from '../../entity/AttributeProduct';
import { Media } from '../../entity/Media';
import { Product } from '../../entity/Product';
import { ProductGroup } from '../../entity/ProductGroup';
import { Setting } from '../../entity/Setting';
import { Tag } from '../../entity/Tag';
import { getTomanPrice, getUniqueCode, getUniqueSlug } from '../../utils/funs';

class AdminProductGroupController {
  static productGroups = () => getRepository(ProductGroup);
  static attributeProducts = () => getRepository(AttributeProduct);
  static attributeGroups = () => getRepository(AttributeGroup);
  static products = () => getRepository(Product);
  static tags = () => getRepository(Tag);
  static medias = () => getRepository(Media);
  static settings = () => getRepository(Setting);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let productGroups = null;
    try {
      productGroups = await this.productGroups().find();
    } catch (e) {
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: productGroups
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      title,
      titleEng,
      shortText,
      longText,
      categoryId,
      attributeGroupId,
      tagId,
      brandId,
      groupStatus,
      sku,
      count,
      price,
      wholesomePrice,
      discountPrice,
      status,
      picture,
      sort
    } = req.body;
    const productGroup = new ProductGroup();
    productGroup.title = title;
    productGroup.titleEng = titleEng;
    productGroup.shortText = shortText;
    productGroup.longText = longText;
    productGroup.brandId = brandId;
    productGroup.sort = sort;
    productGroup.status = groupStatus;
    productGroup.categoryId = categoryId;
    productGroup.attributeGroupId = attributeGroupId;
    productGroup.slug = await getUniqueSlug(getRepository(ProductGroup), title);
    productGroup.code = await getUniqueCode(this.productGroups());
    productGroup.tagId = tagId;
    const errors = await validate(productGroup);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    const medias = {};
    try {
      await Promise.all(
        (req as any).files.map(async (file: any, index) => {

          const newName = await getUniqueSlug(getRepository(Media), productGroup.slug + (++index), 'title');
          const newUrl = req.protocol + '://' + req.get('host') + '/public/uploads/product/' + newName + path.parse(file.originalname).ext;
          const newPath = path.join(process.cwd(), 'public', 'uploads', 'product', newName + path.parse(file.originalname).ext);
          const oldPath = path.join(process.cwd(), file.path);
          fs.exists(oldPath, () => fs.rename(oldPath, newPath, (e) => console.log(e)));
          const newMedia = await getRepository(Media).insert({
            size: file.size,
            title: newName,
            originalTitle: file.originalname,
            mime: file.mimetype,
            path: newPath,
            url: newUrl
          });
          medias[file.fieldname.match(/\d+/)[0]] = newMedia.raw.insertId;
        }));
    } catch (e) {
      console.log(e);
    }

    productGroup.medias = await getRepository(Media).findByIds(Object.values(medias));

    try {
      await this.productGroups().save(productGroup);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }

    let attributeGroup: AttributeGroup = null;
    try {
      attributeGroup = await this.attributeGroups().findOne({ where: { id: productGroup.attributeGroupId } });
    } catch (e) {
      console.log(e);
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    for (let i = 0; i < sku?.length; i++) {
      const product = new Product();
      product.sku = sku[i];
      product.count = Number(count[i]);
      product.price = price[i];
      product.priceToman = await getTomanPrice(price[i]);
      if (Number(wholesomePrice[i])) {
        product.wholesomePrice = wholesomePrice[i];
      }
      if (Number(discountPrice[i])) {
        product.discountPrice = discountPrice[i];
      }
      product.mediaId = medias[picture[i]];
      product.status = status[i];
      product.productGroupId = productGroup.id;
      await this.products().insert(product);
      attributeGroup.attributes.map((attribute) => {
        this.attributeProducts().insert({
          productId: product.id,
          attributeSlug: attribute.slug,
          attributeValueSlug: req.body[`attribute-${attribute.id}`][i],
        });
      });
    }

    return res.status(201).send({
      code: 200,
      data: productGroup
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      titleEng,
      shortText,
      longText,
      categoryId,
      attributeGroupId,
      tagId,
      brandId,
      groupStatus,
      sku,
      count,
      price,
      wholesomePrice,
      discountPrice,
      status,
      picture,
      sort,
      productId
    } = req.body;
    let productGroup: ProductGroup;
    try {
      productGroup = await this.productGroups().findOneOrFail({
        where: { id: Number(id) },
        relations: ['medias', 'products']
      });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    try {
      if (productGroup.medias?.length) {
        await getRepository(Media).delete(productGroup.medias.map(e => e.id));
      }
    } catch (e) {
      console.log(e);
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Media'
      });

    }

    const medias = {};

    try {
      await Promise.all(
        (req as any).files.map(async (file: any, index) => {

          const newName = await getUniqueSlug(getRepository(Media), productGroup.slug + (++index), 'title');
          const newUrl = req.protocol + '://' + req.get('host') + '/public/uploads/product/' + newName + path.parse(file.originalname).ext;
          const newPath = path.join(process.cwd(), 'public', 'uploads', 'product', newName + path.parse(file.originalname).ext);
          const oldPath = path.join(process.cwd(), file.path);
          fs.exists(oldPath, () => fs.rename(oldPath, newPath, (e) => console.log(e)));
          const newMedia = await getRepository(Media).insert({
            size: file.size,
            title: newName,
            originalTitle: file.originalname,
            mime: file.mimetype,
            path: newPath,
            url: newUrl
          });
          medias[file.fieldname.match(/\d+/)[0]] = newMedia.raw.insertId;
        }));
    } catch (e) {
      console.log(e);
    }
    if (title) {
      productGroup.title = title;
      // productGroup.slug = await getUniqueSlug(this.productGroups(), title);
    }
    productGroup.titleEng = titleEng;
    productGroup.shortText = shortText;
    productGroup.longText = longText;
    productGroup.brandId = brandId;
    productGroup.sort = sort;
    productGroup.status = groupStatus;
    productGroup.categoryId = categoryId;
    productGroup.attributeGroupId = attributeGroupId;
    productGroup.medias = await getRepository(Media).findByIds(Object.values(medias));

    const errors = await validate(productGroup);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.productGroups().save(productGroup);
    } catch (e) {
      console.log(e);
      return res.status(409).send('error try again later');
    }

    let attributeGroup: AttributeGroup = null;
    try {
      attributeGroup = await this.attributeGroups().findOne({ where: { id: productGroup.attributeGroupId } });
    } catch (e) {
      console.log(e);
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    for (let i = 0; i < productId?.length; i++) {
      let product;
      try {
        product = await getRepository(Product).findOne({
          where: {
            id: productId[i]
          }
        });
        if (!product) {
          product = new Product();
        }
      } catch (e) {
        return res.status(400).send({
          code: 1002,
          data: 'Invalid Product'
        });
      }
      product.sku = sku[i];
      product.count = Number(count[i]);
      product.price = price[i];
      product.priceToman = await getTomanPrice(price[i]);
      product.wholesomePrice = wholesomePrice[i] || 0;
      product.discountPrice = discountPrice[i] || 0;
      product.mediaId = medias[picture[i]];
      product.status = status[i];
      product.productGroupId = productGroup.id;
      product.productGroup = await getRepository(ProductGroup).findOne({ where: { id: productGroup.id } });
      product.media = await getRepository(Media).findOne({ where: { id: medias[picture[i]] } });
      try {
        await this.products().save(product);
      } catch (e) {
        console.log(e);
        res.status(409).send({
          code: 409,
          data: 'error try again later'
        });
      }
      await Promise.all(attributeGroup.attributes.map(async (attribute) => {
        let attributeProduct;
        try {
          attributeProduct = await getRepository(AttributeProduct).findOne({
            where: {
              productId: product.id,
              attributeSlug: attribute.slug
            }
          });
          if (!attributeProduct){
            attributeProduct = new AttributeProduct();
          }
        } catch (e) {
          return res.status(400).send({
            code: 1002,
            data: 'Invalid Attribute'
          });
        }

        attributeProduct.productId = product.id;
        attributeProduct.attributeSlug = attribute.slug;
        attributeProduct.attributeValueSlug = req.body[`attribute-${attribute.id}`][i];

        try{
          await getRepository(AttributeProduct).save(attributeProduct);
        }catch (e){
          console.log(e);
          res.status(409).send({
            code: 409,
            data: 'error try again later'
          });
        }
      }));
    }

    return res.status(200).send({
      code: 200,
      data: productGroup
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.productGroups().findOneOrFail({
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
      await this.productGroups().delete(id);

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

    let productGroup = null;
    try {
      productGroup = await this.productGroups().findOneOrFail({
        where: { id: Number(id) },
        relations: ['products', 'products.attributes', 'medias'],
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
      return;
    }

    return res.status(200).send({
      code: 200,
      data: productGroup
    });
  };

}

export default AdminProductGroupController;
