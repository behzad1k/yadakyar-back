import { Request, Response } from "express";
import { getManager, getRepository, getTreeRepository } from 'typeorm';
import { Article } from '../entity/Article';
import { ArticleCategory } from '../entity/ArticleCategory';
import { Media } from '../entity/Media';
import {Category} from "../entity/Category";
import sms from '../utils/sms';

class ArticleController {
  static categories = () => getRepository(ArticleCategory)
  static articles = () => getRepository(Article)
  static medias = () => getRepository(Media)

  static index = async (req: Request, res: Response): Promise<Response> => {
    const articles = await getRepository(Article).find();
    return res.status(200).send({
      code: 200,
      data: articles
    })
  }

  static get = async (req: Request, res: Response): Promise<Response> => {
    const { slug } = req.params;

    let article = undefined;
    try{
      article = await this.articles().findOne({
        where: {
          slug: slug
        },
      });
    }catch (e) {
      console.log(e);
      return res.status(400).send({ code: 10000, data: null });
    }
    return res.status(200).send({ code: 200, data: article })
  }
}

export default ArticleController;
