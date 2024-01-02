import { validate } from 'class-validator';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { getConnection, getRepository, getTreeRepository } from 'typeorm';
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
    productGroup.slug = await getUniqueSlug(this.productGroups(), title);
    productGroup.code = await getUniqueCode(this.productGroups());

    let tag = null;
    try{
      tag = await this.tags().findOneOrFail({
        where: { id: tagId }
      })
    }catch (e){
      console.log(e);
      return res.status(400).send({  code: 1002, data: 'Invalid Id' });
    }

    productGroup.tags = tag
    const errors = await validate(productGroup);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await this.productGroups().save(productGroup);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }

    const medias = [];
    try{
      await Promise.all(
        // @ts-ignore
        req.files.map(async (file: any, index) => {
          const newName = await getUniqueSlug(getRepository(Media), productGroup.slug + (++index), 'title');
          const newUrl = req.protocol + '://' + req.get('host') + '/public/uploads/product/' + newName + path.parse(file.originalname).ext;
          const newPath = path.join(process.cwd(), 'public', 'uploads', 'product', newName + path.parse(file.originalname).ext);
          const oldPath = path.join(process.cwd(), file.path)

          fs.existsSync(oldPath) && fs.rename(oldPath, newPath, (e) => console.log(e))
          medias.push(
            await getRepository(Media).insert({
              size: file.size,
              title: newName,
              originalTitle: file.originalname,
              mime: file.mimetype,
              morphType: 'ProductGroup',
              morphId: productGroup.id,
              path: newPath,
              url: newUrl
            }
          ))
        }))
    }catch (e){
      console.log(e);
    }

    let attributeGroup: AttributeGroup = null;
    try {
      attributeGroup = await this.attributeGroups().findOne({ where: { id: productGroup.attributeGroupId } });
    }catch (e){
      console.log(e);
      return res.status(400).send({ code: 1002, data: "Invalid Id" })
    }
    for (let i = 0; i < sku.length; i++) {
      const product = new Product();
      product.sku = sku[i];
      product.count = Number(count[i]);
      product.price = price[i];
      product.priceToman = await getTomanPrice(getRepository(Setting), price[i]);
      product.wholesomePrice = wholesomePrice[i];
      product.discountPrice = discountPrice[i];
      product.mediaId = medias[Number(picture[i]) - 1].raw.insertId
      product.status = status[i]
      product.productGroupId = productGroup.id
      await this.products().insert(product);
      attributeGroup.attributes.map((attribute) => {
        this.attributeProducts().insert({
          productId: product.id,
          attributeSlug: attribute.slug,
          attributeValueSlug: req.body[`attribute-${attribute.id}`][i],
        })
      })
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
      productGroup = await this.productGroups().findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    if (title) {
      productGroup.title = title;
      productGroup.slug = await getUniqueSlug(this.productGroups(), title);
    }

    productGroup.titleEng = titleEng;
    productGroup.shortText = shortText;
    productGroup.longText = longText;
    productGroup.brandId = brandId;
    productGroup.sort = sort;
    productGroup.status = groupStatus;
    productGroup.categoryId = categoryId;
    productGroup.attributeGroupId = attributeGroupId;

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
    }catch (e){
      console.log(e);
      return res.status(400).send({ code: 1002, data: "Invalid Id" })
    }
    const euroPrice = await this.settings().findOne({ where: { key: 'euroPrice' } });

    for (let i = 0; i < sku.length; i++) {
      await this.products().delete({ id: productId[i] });

      let product: Product = new Product();
      product.sku = sku[i];
      product.count = Number(count[i]);
      product.price = price[i];
      product.priceToman = await getTomanPrice(price[i], Number(euroPrice.value));
      product.wholesomePrice = wholesomePrice[i];
      product.discountPrice = discountPrice[i];
      product.mediaId = 95
      // product.mediaId = medias[Number(picture[i]) - 1].raw.insertId
      product.status = status[i]
      product.productGroupId = productGroup.id
      await this.products().insert( product);

      await this.attributeProducts().delete({ productId: productId[i] })

      attributeGroup.attributes.map((attribute) => {
        this.attributeProducts().insert({
          productId: productId[i],
          attributeSlug: attribute.slug,
          attributeValueSlug: req.body[`attribute-${attribute.id}`][i],
        })
      })
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
      // productGroup = await getConnection().query('SELECT * FROM `product_group` INNER JOIN `product` ON product.productGroupId = product_group.id INNER JOIN `attribute_product` ON product.id = attribute_product.productId where product_group.id = ' + Number(id))
      productGroup = await this.productGroups().findOneOrFail({
        where: { id: Number(id) },
        relations:['products', 'products.attributes'],
      })
    } catch (error) {
      console.log(error);
      res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
      return;
    }
    console.log(productGroup);
    return res.status(200).send({
      code: 200,
      data: productGroup
    });
  };

}

export default AdminProductGroupController;
