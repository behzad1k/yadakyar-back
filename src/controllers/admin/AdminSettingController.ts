import { validate } from 'class-validator';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { getRepository } from 'typeorm';
import { Product } from '../../entity/Product';
import { Setting } from '../../entity/Setting';
import { getUniqueSlug } from '../../utils/funs';
import { MulterRequest } from '../../utils/types';
import excelToJson from 'convert-excel-to-json';

class AdminSettingController {
  static settings = () => getRepository(Setting);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let settings = null;
    try {
      settings = await this.settings().find();
    } catch (e) {
      return res.status(501).send({
        code: 501,
        data: 'Unknown Error'
      });
    }

    return res.status(200).send({
      code: 200,
      data: settings
    });
  };

  static create = async (req: Request, res: Response): Promise<Response> => {
    const {
      key,
      value,
    } = req.body;

    const setting = new Setting();

    setting.key = key;
    setting.value = value;
    const errors = await validate(setting);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    try {
      await this.settings().save(setting);
    } catch (e) {
      console.log(e);
      return res.status(409).send({
        code: 409,
        data: 'error try again later'
      });
    }
    return res.status(201).send({
      code: 200,
      data: setting
    });
  };

  static update = async (req: Request, res: Response): Promise<Response> => {
    const { key } = req.params;
    console.log(key);
    const {
      value,
    } = req.body;
    try {
      await this.settings().update({
        key: key
      },{ value: value });
    } catch (error) {
      return res.status(400).send({
        code: 409,
        data: 'Invalid Id'
      });
    }

    return res.status(200).send({
      code: 200,
      data: {  }
    });
  };

  static delete = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await this.settings().findOneOrFail({
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
      await this.settings().delete(id);

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
    let setting = null;
    try {
      setting = await this.settings().findOneOrFail({
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
      data: setting
    });
  };

  static setEuroPrice = async (req: Request, res: Response): Promise<Response> => {
    const { derham } = req.body;

    let result = undefined;
    try{
      result = await this.settings().update({
          key: 'derhamPrice'
        },
        {
          value: derham
        }
      )
    }catch (e) {
      return res.status(400).send({
        code: 409,
        data: "Something went wring"
      });
    }
    return res.status(200).send({
      code: 200,
      data: result
    })
  }
  static excel = async (req: Request, res: Response): Promise<Response> => {
    const data = excelToJson({ sourceFile: (req as any).file.path})
    await Promise.all(data?.Feuil1?.slice(1,5).map(async (obj) => {
      let product = await getRepository(Product).findOne({ where: { sku: obj.A } })

      if (!product){
        product = new Product();
        product.sku = obj.A
        product.productGroupId = null
        product.isPre = true;
        product.price = 0;
        product.priceToman = 0;
      }

      if (obj.C <= 0 ){
        product.status = 0;
        product.count = 0;
      } else {
        product.status = 1;
        product.count = obj.C
      }

      if (obj.D.toString().includes('20')){
        product.nextAvailable = obj.D;
      }

      await getRepository(Product).save(product)
    }))
    return res.status(200).send({code: 200,data: data});
  }

}

export default AdminSettingController;
