import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Tag } from '../../entity/Tag';
import { getUniqueSlug } from '../../utils/funs';

class AdminTagController {
  static tags = () => getRepository(Tag);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let tags = null;
    try {
      tags = await this.tags().find();
    } catch (e) {
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: tags
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      title,
      description,
    } = req.body;

    const tag = new Tag();

    tag.title = title;
    tag.description = description;
    tag.slug = await getUniqueSlug(this.tags(), title);
    const errors = await validate(tag);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await this.tags().save(tag);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(201).send({
      code: 200,
      data: tag
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      description,
    } = req.body;
    let tag: Tag;
    console.log(Number(id));
    try {
      tag = await this.tags().findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    if (title) {
      tag.title = title;
      tag.slug = await getUniqueSlug(this.tags(), title);
    }
    if (description) {
      tag.description = description;
    }

    const errors = await validate(tag);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.tags().save(tag);
    } catch (e) {
      return res.status(409).send('error try again later');
    }
    return res.status(200).send({
      code: 200,
      data: tag
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.tags().findOneOrFail({
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
      await this.tags().delete(id);

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
    let tag = null;
    try {
      tag = await this.tags().findOneOrFail({
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
      data: tag
    });
  };

}

export default AdminTagController;
