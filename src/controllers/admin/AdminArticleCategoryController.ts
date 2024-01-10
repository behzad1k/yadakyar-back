import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository, getTreeRepository } from 'typeorm';
import { ArticleCategory } from '../../entity/ArticleCategory';
import { getUniqueSlug } from '../../utils/funs';

class AdminArticleCategoryController {
  static articleCateogories = () => getRepository(ArticleCategory);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let articleCateogories = null;
    try {
      articleCateogories = await getRepository(ArticleCategory).find();
    } catch (e) {
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: articleCateogories
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      title,
      description,
    } = req.body;

    const ArticleCateogory = new ArticleCategory();

    ArticleCateogory.title = title;
    ArticleCateogory.description = description;
    ArticleCateogory.slug = await getUniqueSlug(this.articleCateogories(), title);
    const errors = await validate(ArticleCateogory);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await this.articleCateogories().save(ArticleCateogory);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(201).send({
      code: 200,
      data: ArticleCateogory
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      description,
      parentId
    } = req.body;
    let ArticleCateogory: ArticleCategory;
    console.log(Number(id));
    try {
      ArticleCateogory = await this.articleCateogories().findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    if (title) {
      ArticleCateogory.title = title;
      ArticleCateogory.slug = await getUniqueSlug(this.articleCateogories(), title);
    }
    if (description) {
      ArticleCateogory.description = description;
    }
    // if (parentId) {
    //   ArticleCateogory.parentId = parentId;
    // }

    const errors = await validate(ArticleCateogory);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.articleCateogories().save(ArticleCateogory);
    } catch (e) {
      return res.status(409).send('error try again later');
    }
    return res.status(200).send({
      code: 200,
      data: ArticleCateogory
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.articleCateogories().findOneOrFail({
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
      await this.articleCateogories().delete(id);

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
    let ArticleCateogory = null;
    try {
      ArticleCateogory = await this.articleCateogories().findOneOrFail({
        where: { id: Number(id) },
      });
    } catch (error) {
      res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
      return;
    }
    return res.status(200).send({code: 200, data: ArticleCateogory });
  };

}

export default AdminArticleCategoryController;
