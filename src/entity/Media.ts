import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent, OneToOne,
} from 'typeorm';
import { Length } from "class-validator";
import { dataTypes } from '../utils/enums';
import { Article } from './Article';
import { Catalog } from './Catalog';
import { Order } from "./Order";
import { Product } from './Product';
import { ProductGroup } from './ProductGroup';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  mime: string;

  @Column(dataTypes.text)
  size: string;

  @Column(dataTypes.text)
  path: string;

  @Column(dataTypes.text)
  url: string;

  @Column(dataTypes.text)
  originalTitle: string;


  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, product => product.media)
  products: Product[]

  @OneToMany(() => Article, article => article.media)
  articles: Article[]

  @OneToMany(() => Catalog, catalog => catalog.media)
  catalogs: Catalog[]

  @ManyToMany(() => ProductGroup, productGroup => productGroup.medias)
  @JoinTable({
    name: 'productGroup_media',
  })
  productGroups: ProductGroup[]
}

