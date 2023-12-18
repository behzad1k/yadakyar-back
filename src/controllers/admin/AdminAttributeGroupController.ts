import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { getRepository, getTreeRepository } from 'typeorm';
import { Attribute } from '../../entity/Attribute';
import { AttributeGroup } from '../../entity/AttributeGroup';
import { getUniqueSlug } from '../../utils/funs';

class AdminAttributeGroupController {
  static attributeGroups = () => getRepository(AttributeGroup);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let attributeGroups = null;
    try {
      attributeGroups = await this.attributeGroups().find({
        relations: ['attributes']
      })
    } catch (e) {
      console.log(e);
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: attributeGroups
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      title,
      description,
      attributes
    } = req.body;
    const attributeGroup = new AttributeGroup();
    attributeGroup.title = title;
    attributeGroup.description = description;
    attributeGroup.slug = await getUniqueSlug(this.attributeGroups(), title);
    const errors = await validate(attributeGroup);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    `let attributeObjs = [];
    try{
      await Promise.all(attributes.map(async (attributeId: number) => {
        attributeObjs.push(await getRepository(Attribute).findOneOrFail({ where: {id: attributeId}}))
      }));
    }catch (e){
      console.log(e);
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }`
    // attributeGroup.attributeObjs = attributes;

    try {
      await this.attributeGroups().save(attributeGroup);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(201).send({
      code: 200,
      data: attributeGroup
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      description,
      parentId
    } = req.body;
    let attributeGroup: AttributeGroup;
    console.log(Number(id));
    try {
      attributeGroup = await this.attributeGroups().findOneOrFail({ where: { id: Number(id) } });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }
    if (title) {
      attributeGroup.title = title;
      attributeGroup.slug = await getUniqueSlug(this.attributeGroups(), title);
    }
    if (description) {
      attributeGroup.description = description;
    }

    const errors = await validate(attributeGroup);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }
    try {
      await this.attributeGroups().save(attributeGroup);
    } catch (e) {
      return res.status(409).send('error try again later');
    }
    return res.status(200).send({
      code: 200,
      data: attributeGroup
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.attributeGroups().findOneOrFail({
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
      await this.attributeGroups().delete(id);

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
    let attributeGroup = null;
    try {
      attributeGroup = await this.attributeGroups().findOneOrFail({
        where: { id: Number(id) },
        relations: ['attributes']
      });
    } catch (error) {
      res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
      return;
    }
    return res.status(200).send({code: 200, data: attributeGroup });
  };

}

export default AdminAttributeGroupController;
