import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Brand } from '../../entity/Brand';
import { getUniqueSlug } from '../../utils/funs';

class AdminBrandController {
  static brands = () => getRepository(Brand);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let brands = null;
    try {
      brands = await this.brands().find();
    } catch (e) {
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: brands
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      title,
      description,
    } = req.body;

    const brand = new Brand();

    brand.title = title;
    brand.description = description;
    brand.slug = await getUniqueSlug(this.brands(), title);
    const errors = await validate(brand);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await this.brands().save(brand);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(201).send({
      code: 200,
      data: brand
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      description,
    } = req.body;
    let brand: Brand;
    console.log(Number(id));
    try {
      brand = await this.brands().findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    if (title) {
      brand.title = title;
      brand.slug = await getUniqueSlug(this.brands(), title);
    }
    if (description) {
      brand.description = description;
    }

    const errors = await validate(brand);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.brands().save(brand);
    } catch (e) {
      return res.status(409).send('error try again later');
    }
    return res.status(200).send({
      code: 200,
      data: brand
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.brands().findOneOrFail({
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
      await this.brands().delete(id);

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
    let brand = null;
    try {
      brand = await this.brands().findOneOrFail({
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
      data: brand
    });
  };

}

export default AdminBrandController;
