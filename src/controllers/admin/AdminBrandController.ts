import { validate } from 'class-validator';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { getRepository } from 'typeorm';
import { Brand } from '../../entity/Brand';
import { Catalog } from '../../entity/Catalog';
import { Media } from '../../entity/Media';
import { getUniqueSlug } from '../../utils/funs';

class AdminBrandController {
  static brands = () => getRepository(Brand);

  static index = async (req: Request, res: Response): Promise<Response> => {
    let brands = null;
    try {
      brands = await this.brands().find({
        relations: ['catalogs']
      });
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
      catalogTitles,
      catalogSorts
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
    const medias = [];
    try {
      await Promise.all(
        (req as any).files.map(async (file: any, index) => {
          const newName = await getUniqueSlug(getRepository(Media), brand.slug + (++index), 'title');
          const newUrl = req.protocol + '://' + req.get('host') + '/public/uploads/catalog/' + newName + path.parse(file.originalname).ext;
          const newPath = path.join(process.cwd(), 'public', 'uploads', 'catalog', newName + path.parse(file.originalname).ext);
          const oldPath = path.join(process.cwd(), file.path);
          fs.exists(oldPath, () => fs.rename(oldPath, newPath, (e) => console.log(e)));
          medias.push(
            await getRepository(Media).insert({
                size: file.size,
                title: newName,
                originalTitle: file.originalname,
                mime: file.mimetype,
                path: newPath,
                url: newUrl
              }
            ));
        }));
    } catch (e) {
      console.log(e);
    }

    for (let i = 0; i < catalogTitles.length; i++) {
      try {
        const catalog = new Catalog();

        catalog.brandId = brand.id;
        catalog.title = catalogTitles[i];
        catalog.sort = catalogSorts[i];
        catalog.slug = await getUniqueSlug(getRepository(Catalog), catalogTitles[i]);
        catalog.mediaId = medias[i].raw.insertId;
        await getRepository(Catalog).save(catalog);
      } catch (e) {
        console.log(e);
        return res.status(409).send({
          code: 409,
          data: 'error try again later catalog'
        });
      }
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
    return res.status(204).send({
      code: 200,
      data: ''
    });
  };

  static single = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    let brand = null;
    try {
      brand = await this.brands().findOneOrFail({
        where: { id: Number(id) },
        relations: ['catalogs']
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

  static updateCatalog = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const {
      title,
      sort
    } = req.body;
    const file = (req as any).file;
    let catalog;
    try {
      catalog = await getRepository(Catalog).findOneOrFail({ where: { id: Number(id) }, relations: ['brand'] });

      catalog.title = title;
      catalog.sort = sort;

      if (file) {
        // todo: delete the file itself
        await getRepository(Media).delete({
          id: catalog.mediaId
        });

        const newName = await getUniqueSlug(getRepository(Media), catalog.brand.slug, 'title');
        const newUrl = req.protocol + '://' + req.get('host') + '/public/uploads/catalog/' + newName + path.parse(file.originalname).ext;
        const newPath = path.join(process.cwd(), 'public', 'uploads', 'catalog', newName + path.parse(file.originalname).ext);
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

        catalog.mediaId = newFile.raw.insertId;
      }

      await getRepository(Catalog).save(catalog);
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }

    return res.status(200).send({
      code: 200,
      data: 'Successful'
    });
  };

  static deleteCatalog = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      await getRepository(Catalog).delete({
        id: Number(id)
      });
    } catch (error) {
      return res.status(400).send({
        code: 1002,
        data: 'Invalid Id'
      });
    }

    return res.status(200).send({
      code: 204,
      data: 'Successful'
    });
  };

}

export default AdminBrandController;
