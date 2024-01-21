import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository, getTreeRepository } from 'typeorm';
import { Attribute } from '../../entity/Attribute';
import { AttributeValue } from '../../entity/AttributeValue';
import { getUniqueSlug } from '../../utils/funs';

class AdminAttributeValueController {
  static attributeValues = () => getRepository(AttributeValue);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let attributeValues = null;
    try {
      attributeValues = await this.attributeValues().find({
        relations: ['attribute']
      });
    } catch (e) {
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: attributeValues
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      title,
      description,
      attributeId
    } = req.body;
    const attributeValue = new AttributeValue();

    attributeValue.title = title;
    attributeValue.description = description;
    attributeValue.slug = await getUniqueSlug(this.attributeValues(), title);
    attributeValue.attributeId = attributeId;

    const errors = await validate(attributeValue);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await this.attributeValues().save(attributeValue);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(201).send({
      code: 200,
      data: attributeValue
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      description,
      parentId
    } = req.body;
    let attributeValue: AttributeValue;
    console.log(Number(id));
    try {
      attributeValue = await this.attributeValues().findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    if (title) {
      attributeValue.title = title;
      attributeValue.slug = await getUniqueSlug(this.attributeValues(), title);
    }
    if (description) {
      attributeValue.description = description;
    }

    const errors = await validate(attributeValue);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.attributeValues().save(attributeValue);
    } catch (e) {
      return res.status(409).send('error try again later');
    }
    return res.status(200).send({
      code: 200,
      data: attributeValue
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.attributeValues().findOneOrFail({
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
      await this.attributeValues().delete(id);

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
    let attributeValue = null;
    try {
      attributeValue = await this.attributeValues().findOneOrFail({
        where: { id: Number(id) },
        relations: ['attribute']
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
      data: attributeValue
    });
  };

}

export default AdminAttributeValueController;
