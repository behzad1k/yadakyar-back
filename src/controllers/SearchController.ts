import { Request, Response } from "express";
import { createQueryBuilder, getConnection, getManager, getRepository, getTreeRepository, Like } from 'typeorm';
import { Attribute } from '../entity/Attribute';
import { AttributeProduct } from '../entity/AttributeProduct';
import { Brand } from '../entity/Brand';
import { Category } from '../entity/Category';
import { Media } from '../entity/Media';
import {Menu} from "../entity/Menu";
import { Product } from '../entity/Product';
import { ProductGroup } from '../entity/ProductGroup';
import { Tag } from '../entity/Tag';
import sms from '../utils/sms';

class SearchController {
  static productGroups = () => getRepository(ProductGroup)
  static categories = () => getRepository(Category)
  static brands = () => getRepository(Brand)
  static tags = () => getRepository(Tag)
  static medias = () => getRepository(Media)


  static index = async (req: Request, res: Response): Promise<Response> => {
    const { query } = req.params
    const result: any = {};

    try{
      result.products = await this.productGroups().find({
        where: [
          { title: Like(`%${query}%`) },
          { titleEng: Like(`%${query}%`) }
        ],
        relations: ['category', 'products']
      })
    }catch (e){
      console.log(e);
    }

    try{
      result.categories = await this.categories().find({
        where: [
          { title: Like(`%${query}%`) },
        ]
      })
    }catch (e){
      console.log(e);
    }

    try{
      result.brands = await this.brands().find({
        where: [
          { title: Like(`%${query}%`) },
        ]
      })
    }catch (e){
      console.log(e);
    }

    try{
      result.tags = await this.tags().find({
        where: [
          { title: Like(`%${query}%`) },
        ]
      })
    }catch (e){
      console.log(e);
    }

    return res.status(200).send({
      code: 200,
      data: result
    })
  }
}

export default SearchController;
