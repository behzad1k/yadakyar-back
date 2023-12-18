import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository, getTreeRepository } from 'typeorm';
import { Category } from '../../entity/Category';
import { getUniqueSlug } from '../../utils/funs';

class AdminCategoryController {
  static categories = () => getRepository(Category);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let categories = null;
    try {
      categories = await getTreeRepository(Category).findTrees();
    } catch (e) {
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: categories
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      title,
      description,
      parentId
    } = req.body;

    const category = new Category();

    category.title = title;
    category.parentId = parentId;
    category.description = description;
    category.slug = await getUniqueSlug(this.categories(), title);
    const errors = await validate(category);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await this.categories().save(category);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(201).send({
      code: 200,
      data: category
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      description,
      parentId
    } = req.body;
    let category: Category;
    console.log(Number(id));
    try {
      category = await this.categories().findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    if (title) {
      category.title = title;
      category.slug = await getUniqueSlug(this.categories(), title);
    }
    if (description) {
      category.description = description;
    }
    if (parentId) {
      category.parentId = parentId;
    }

    const errors = await validate(category);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.categories().save(category);
    } catch (e) {
      return res.status(409).send('error try again later');
    }
    return res.status(200).send({
      code: 200,
      data: category
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.categories().findOneOrFail({
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
      await this.categories().delete(id);

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
    let category = null;
    try {
      category = await this.categories().findOneOrFail({
        where: { id: Number(id) },
      });
    } catch (error) {
      res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
      return;
    }
    return res.status(200).send({code: 200, data: category });
  };

}

export default AdminCategoryController;
