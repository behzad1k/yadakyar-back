import { validate } from 'class-validator';
import { Request, Response } from 'express';
import jwtDecode from 'jwt-decode';
import { getRepository, In } from 'typeorm';
import { Article } from '../../entity/Article';
import { ArticleCategory } from '../../entity/ArticleCategory';
import { Category } from '../../entity/Category';
import { User } from '../../entity/User';
import { getUniqueSlug } from '../../utils/funs';
import {Media} from "../../entity/Media";
import path from "path";
import process from "process";
import fs from "fs";

class AdminArticleController {
  static articles = () => getRepository(Article);
  static users = () => getRepository(User);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let articles = null;
    try {
      articles = await this.articles().find();
    } catch (e) {
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: articles
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const token: any = jwtDecode(req.headers.authorization);
    const userId: number = token.userId;
    const {
      title,
      long,
      short,
      keywords,
      articleCategories
    } = req.body;
    let user;
    try {
      user = await this.users().findOneOrFail({
        where: { id: userId },
      });
    } catch (error) {
      res.status(400).send({
        code: 400,
        data: 'Invalid User'
      });
      return;
    }

    const file = (req as any).file;
    const newName = await getUniqueSlug(getRepository(Media),title , 'title');
    const newUrl = req.protocol + '://' + req.get('host') + '/public/uploads/article/' + newName + path.parse(file.originalname).ext;
    const newPath = path.join(process.cwd(), 'public', 'uploads', 'article', newName + path.parse(file.originalname).ext);
    const oldPath = path.join(process.cwd(), file.path);
    fs.exists(oldPath, () => fs.rename(oldPath, newPath, (e) => console.log(e)));
    const newFile = await getRepository(Media).insert({
      size: file.size.toString(),
      title: newName,
      originalTitle: file.originalname,
      mime: file.mimetype,
      path: newPath,
      url: newUrl
    })

    const article = new Article();

    article.title = title;
    article.long = long;
    article.short = short;
    article.keywords = keywords;
    article.authorId = user.id;
    article.slug = await getUniqueSlug(this.articles(), title);
    article.mediaId = newFile.raw.insertId;
    article.categories = await getRepository(ArticleCategory).findBy({ id: In(articleCategories) })

    const errors = await validate(article);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await this.articles().save(article);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(201).send({
      code: 200,
      data: article
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      long,
      short,
      keywords,
      articleCategories
    } = req.body;

    let article: Article;
    // todo: fix this function sajad
    try {
      article = await this.articles().findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    if (title) {
      article.title = title;
      article.slug = await getUniqueSlug(this.articles(), title);
    }
    if (long) {
      article.long = long;
    }
    if (short) {
      article.short = short;
    }

    const errors = await validate(article);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.articles().save(article);
    } catch (e) {
      return res.status(409).send('error try again later');
    }
    return res.status(200).send({
      code: 200,
      data: article
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.articles().findOneOrFail({
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
      await this.articles().delete(id);

    } catch (e) {
      res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(204).send({ code: 200, data: '' });
  };

  static single = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    let article = null;
    try {
      article = await this.articles().findOneOrFail({
        where: { id: Number(id) },
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
      data: article
    });
  };

}

export default AdminArticleController;
