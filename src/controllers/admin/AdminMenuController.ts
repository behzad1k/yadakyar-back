import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository, getTreeRepository } from 'typeorm';
import { Menu } from '../../entity/Menu';
import { getUniqueSlug } from '../../utils/funs';

class AdminMenuController {
  static menus = () => getRepository(Menu);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let menus = null;
    try {
      menus = await this.menus().find({
        relations: ['parent']
      });
    } catch (e) {
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: menus
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      title,
      description,
      link,
      parentId
    } = req.body;

    const menu = new Menu();

    if (parentId) {
      try {
        menu.parent = await this.menus().findOneOrFail({
          where: { id: parentId }
        });
      } catch (e) {
        return res.status(501).send({
          code: 1002,
          data: 'Invalid ID'
        });
      }
    }

    menu.title = title;
    menu.link = link;
    menu.description = description;
    menu.slug = await getUniqueSlug(this.menus(), title);
    const errors = await validate(menu);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await this.menus().save(menu);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(201).send({
      code: 200,
      data: menu
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      description,
      link,
      parentId
    } = req.body;
    let menu: Menu;
    console.log(Number(id));
    try {
      menu = await this.menus().findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    let parent = undefined;
    try {
      parent = await this.menus().findOneOrFail({
        where:{ id: parentId }
      });
    } catch (e) {
      return res.status(501).send({
        code: 1002,
        data: 'Invalid ID'
      });
    }

    if (title) {
      menu.title = title;
      menu.slug = await getUniqueSlug(this.menus(), title);
    }
    if (description) {
      menu.description = description;
    }
    if (parent) {
      menu.parent = parent;
    }if (link) {
      menu.link = link;
    }

    const errors = await validate(menu);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.menus().save(menu);
    } catch (e) {
      return res.status(409).send('error try again later');
    }
    return res.status(200).send({
      code: 200,
      data: menu
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.menus().findOneOrFail({
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
      await this.menus().delete(id);

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
    let menu = null;
    try {
      menu = await this.menus().findOneOrFail({
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
      data: menu
    });
  };

}

export default AdminMenuController;
