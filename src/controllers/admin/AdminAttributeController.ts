import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository, getTreeRepository } from 'typeorm';
import { Attribute } from '../../entity/Attribute';
import { AttributeGroup } from '../../entity/AttributeGroup';
import { getUniqueSlug } from '../../utils/funs';

class AdminAttributeController {
  static attributes = () => getRepository(Attribute);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let attributes = null;
    try {
      attributes = await getTreeRepository(Attribute).findTrees();
    } catch (e) {
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: attributes
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      title,
      description,
      parentId,
      attributeGroups
    } = req.body;

    const attribute = new Attribute();

    attribute.title = title;
    attribute.parentId = parentId;
    attribute.description = description;
    attribute.slug = await getUniqueSlug(getRepository(Attribute), title);

    const errors = await validate(attribute);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    let attributeGroupObjs = [];
    try{
      await Promise.all(attributeGroups.map(async (attributeId: number) => {
        attributeGroupObjs.push(await getRepository(AttributeGroup).findOneOrFail({ where: { id: attributeId }}))
      }));
    }catch (e){
      console.log(e);
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }

    attribute.attributeGroups = attributeGroupObjs;


    try {
      await this.attributes().save(attribute);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(201).send({
      code: 200,
      data: attribute
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      description,
      parentId
    } = req.body;
    let attribute: Attribute;
    try {
      attribute = await this.attributes().findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    if (title) {
      attribute.title = title;
      attribute.slug = await getUniqueSlug(this.attributes(), title);
    }
    if (description) {
      attribute.description = description;
    }
    if (parentId) {
      attribute.parentId = parentId;
    }

    const errors = await validate(attribute);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.attributes().save(attribute);
    } catch (e) {
      return res.status(409).send('error try again later');
    }
    return res.status(200).send({
      code: 200,
      data: attribute
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.attributes().findOneOrFail({
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
      await this.attributes().delete(id);

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
    let attribute = null;
    try {
      attribute = await this.attributes().findOneOrFail({
        where: { id: Number(id) },
      });
    } catch (error) {
      res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
      return;
    }
    return res.status(200).send({code: 200, data: attribute });
  };

}

export default AdminAttributeController;
