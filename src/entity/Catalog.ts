import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany, ManyToMany, JoinTable, TreeChildren, Tree, TreeParent, ManyToOne, JoinColumn,
} from 'typeorm';
import { Length } from "class-validator";
import { CategoryEnum, dataTypes } from '../utils/enums';
import { AttributeProduct } from './AttributeProduct';
import { Brand } from './Brand';
import { Media } from './Media';
import { Order } from "./Order";
import { Product } from './Product';
import { ProductGroup } from './ProductGroup';
import { User } from "./User";
import "reflect-metadata";
@Entity()
export class Catalog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(dataTypes.text)
  title: string;

  @Column(dataTypes.text)
  slug: string;

  @Column(dataTypes.integer )
  brandId: number;

  @Column(dataTypes.integer )
  mediaId: number;

  @Column(dataTypes.varchar )
  sort: string;

  @Column(dataTypes.datetime)
  @CreateDateColumn()
  createdAt: Date;

  @Column(dataTypes.datetime)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Brand, brand => brand.catalogs, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'brandId',
    referencedColumnName: 'id'
  })
  brand: Brand

  @ManyToOne(() => Media, media => media.catalogs,{ eager: true ,onDelete: 'CASCADE'})
  @JoinColumn({
    name: 'mediaId',
    referencedColumnName: 'id'
  })
  media: Media
}
